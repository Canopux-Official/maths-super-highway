import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Testimonial from '../models/testimonials';
import Course from '../models/courses';
import Enrollment from '../models/enrollment';
import User from '../models/user';

export const FEEDBACK_LIMIT = 5;
export const LANDING_MIN_AVG = 4.2;
export const LANDING_MIN_COUNT = 3;

const fail = (res: Response, status: number, message: string) =>
  res.status(status).json({ success: false, message });

const checkBody = (rating: unknown, message: unknown): string | null => {
  if (!Number.isInteger(rating) || (rating as number) < 1 || (rating as number) > 5) return 'Please choose a rating from 1 to 5.';
  if (typeof message !== 'string' || message.trim().length < 20) return 'Please write at least 20 characters.';
  if (message.trim().length > 1000) return 'Please keep it under 1000 characters.';
  return null;
};

// ───────────────────────── Shared: rating stats per node ─────────────────────────
// own = reviews written on the node itself; all = node + everything inside it.
type Stat = { count: number; sum: number };
export const computeNodeStats = async () => {
  const [groups, nodes] = await Promise.all([
    Testimonial.aggregate([{ $group: { _id: '$course', count: { $sum: 1 }, sum: { $sum: '$rating' } } }]),
    Course.find().select('ancestors').lean(),
  ]);
  const ancestorsOf = new Map(nodes.map((n) => [n._id.toString(), n.ancestors.map(String)]));
  const own = new Map<string, Stat>();
  const all = new Map<string, Stat>();
  const add = (m: Map<string, Stat>, id: string, count: number, sum: number) => {
    const s = m.get(id) ?? { count: 0, sum: 0 };
    s.count += count; s.sum += sum; m.set(id, s);
  };
  groups.forEach((g) => {
    const id = g._id.toString();
    if (!ancestorsOf.has(id)) return; // review of a deleted node
    add(own, id, g.count, g.sum);
    add(all, id, g.count, g.sum);
    ancestorsOf.get(id)!.forEach((a) => add(all, a, g.count, g.sum));
  });
  return { own, all };
};
const avg = (s?: Stat) => (s && s.count ? Math.round((s.sum / s.count) * 10) / 10 : 0);

// ───────────────────────── Student ─────────────────────────

// GET /testimonials/mine
export const getMyFeedback = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return fail(res, 401, 'Unauthorized access');
    const rows = await Testimonial.find({ user: new Types.ObjectId(userId) })
      .select('course rating message updatedAt')
      .lean();
    return res.status(200).json({
      success: true,
      data: {
        limit: FEEDBACK_LIMIT,
        used: rows.length,
        reviews: rows.map((r) => ({
          _id: r._id, courseId: r.course.toString(), rating: r.rating, message: r.message, updatedAt: r.updatedAt,
        })),
      },
    });
  } catch (e: any) {
    return fail(res, 500, e.message);
  }
};

// POST /testimonials/create   { courseId, rating, message }
export const createTestimonial = async (req: Request, res: Response) => {
  let reserved = false;
  const userId = req.user?.userId;
  try {
    if (!userId) return fail(res, 401, 'Unauthorized access');
    const { courseId, rating, message } = req.body;
    const bad = checkBody(rating, message);
    if (bad) return fail(res, 400, bad);
    if (!Types.ObjectId.isValid(courseId)) return fail(res, 400, 'Invalid topic');

    const student = new Types.ObjectId(userId);
    const node = await Course.findById(courseId).select('isActive ancestors').lean();
    if (!node || !node.isActive) return fail(res, 404, 'Topic not found');
    if (node.ancestors.length &&
      await Course.exists({ _id: { $in: node.ancestors }, isActive: false })) return fail(res, 404, 'Topic not found');

    // Must currently hold this topic (or a leaf inside it)
    const inside = [node._id, ...(await Course.find({ ancestors: node._id }).distinct('_id'))];
    if (!(await Enrollment.exists({ student, course: { $in: inside } }))) {
      return fail(res, 403, 'You can only give feedback on topics you have selected.');
    }
    if (await Testimonial.exists({ user: student, course: node._id })) {
      return fail(res, 409, 'You already gave feedback on this topic. You can edit it.');
    }

    // Atomic slot reservation: two quick requests can never go past the limit
    const slot = await User.findOneAndUpdate(
      { _id: student, feedbackCount: { $not: { $gte: FEEDBACK_LIMIT } } },
      { $inc: { feedbackCount: 1 } }
    );
    if (!slot) return fail(res, 403, `You have used all ${FEEDBACK_LIMIT} feedbacks.`);
    reserved = true;

    const created = await Testimonial.create({ user: student, course: node._id, rating, message: message.trim() });
    return res.status(201).json({ success: true, data: created });
  } catch (e: any) {
    if (reserved && userId) await User.updateOne({ _id: userId, feedbackCount: { $gt: 0 } }, { $inc: { feedbackCount: -1 } });
    if (e.code === 11000) return fail(res, 409, 'You already gave feedback on this topic. You can edit it.');
    return fail(res, 500, e.message);
  }
};

// PATCH /testimonials/update/:id   { rating, message }   (owner only; students cannot delete)
export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { rating, message } = req.body;
    const bad = checkBody(rating, message);
    if (bad) return fail(res, 400, bad);

    const t = await Testimonial.findById(req.params.id);
    if (!t) return fail(res, 404, 'Feedback not found');
    if (t.user.toString() !== userId) return fail(res, 403, 'You can only edit your own feedback');

    const changed = t.rating !== rating || t.message !== message.trim();
    if (changed) {
      t.rating = rating;
      t.message = message.trim();
      t.showOnLanding = false; // the new text has not been approved by the admin
      await t.save();
    }
    return res.status(200).json({ success: true, data: t });
  } catch (e: any) {
    return fail(res, 500, e.message);
  }
};

// ───────────────────────── Admin ─────────────────────────

// GET /testimonials/admin/stats -> { [nodeId]: { ownCount, ownAvg, allCount, allAvg } }
export const getReviewStats = async (_req: Request, res: Response) => {
  try {
    const { own, all } = await computeNodeStats();
    const data: Record<string, { ownCount: number; ownAvg: number; allCount: number; allAvg: number }> = {};
    all.forEach((a, id) => {
      const o = own.get(id);
      data[id] = { ownCount: o?.count ?? 0, ownAvg: avg(o), allCount: a.count, allAvg: avg(a) };
    });
    res.set('Cache-Control', 'private, no-cache');
    return res.status(200).json({ success: true, data });
  } catch (e: any) {
    return fail(res, 500, e.message);
  }
};

// GET /testimonials/admin/node/:id?inside=1  -> reviews of this node (and optionally everything inside it)
export const getNodeReviews = async (req: Request, res: Response) => {
  try {
    const oid = new Types.ObjectId(req.params.id as string);
    const inside = req.query.inside === '1';
    const ids = inside ? [oid, ...(await Course.find({ ancestors: oid }).distinct('_id'))] : [oid];

    const rows = await Testimonial.aggregate([
      { $match: { course: { $in: ids } } },
      { $sort: { createdAt: -1 } },
      { $limit: 500 },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'u' } },
      { $unwind: '$u' },
      { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'c' } },
      { $unwind: '$c' },
      {
        $project: {
          rating: 1, message: 1, showOnLanding: 1, createdAt: 1, updatedAt: 1,
          studentName: '$u.name', studentEmail: '$u.email', topic: '$c.title',
        },
      },
    ]);
    const average = rows.length ? Math.round((rows.reduce((s, r) => s + r.rating, 0) / rows.length) * 10) / 10 : 0;
    return res.status(200).json({ success: true, data: { reviews: rows, count: rows.length, average } });
  } catch (e: any) {
    return fail(res, 500, e.message);
  }
};

// PATCH /testimonials/admin/:id/visibility   { showOnLanding: boolean }
export const setLandingVisibility = async (req: Request, res: Response) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, { showOnLanding: !!req.body.showOnLanding }, { new: true });
    if (!t) return fail(res, 404, 'Feedback not found');
    return res.status(200).json({ success: true, data: { _id: t._id, showOnLanding: t.showOnLanding } });
  } catch (e: any) {
    return fail(res, 500, e.message);
  }
};

// DELETE /testimonials/admin/:id  -> removes it and gives the student the slot back
export const adminDeleteTestimonial = async (req: Request, res: Response) => {
  try {
    const t = await Testimonial.findByIdAndDelete(req.params.id);
    if (!t) return fail(res, 404, 'Feedback not found');
    await User.updateOne({ _id: t.user, feedbackCount: { $gt: 0 } }, { $inc: { feedbackCount: -1 } });
    return res.status(200).json({ success: true, message: 'Deleted' });
  } catch (e: any) {
    return fail(res, 500, e.message);
  }
};

// ───────────────────────── Landing page ─────────────────────────
// Shown only if: admin switched it on AND the topic's average (topic + everything inside it)
// is at least 4.5 from at least 3 reviews.
export const getLandingPageTestimonials = async (_req: Request, res: Response) => {
  try {
    const { all } = await computeNodeStats();
    const eligible = [...all.entries()]
      .filter(([, s]) => s.count >= LANDING_MIN_COUNT && s.sum / s.count >= LANDING_MIN_AVG)
      .map(([id]) => new Types.ObjectId(id));

    const rows = eligible.length
      ? await Testimonial.aggregate([
        { $match: { showOnLanding: true, course: { $in: eligible } } },
        { $sort: { rating: -1, updatedAt: -1 } },
        { $limit: 12 },
        { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'u' } },
        { $unwind: '$u' },
        { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'c' } },
        { $unwind: '$c' },
        { $project: { rating: 1, message: 1, createdAt: 1, name: '$u.name', title: '$c.title', courseId: '$course' } },
      ])
      : [];

    // "Priya Sharma" -> "Priya S." (no full surnames on a public page)
    const shortName = (n: string) => {
      const p = String(n).trim().split(/\s+/);
      return p.length > 1 ? `${p[0]} ${p[p.length - 1][0].toUpperCase()}.` : p[0];
    };

    const data = rows.map((r) => ({
      _id: r._id,
      rating: r.rating,
      message: r.message,
      createdAt: r.createdAt,
      user: { name: shortName(r.name) },
      course: { title: r.title, average: avg(all.get(r.courseId.toString())) },
    }));

    res.set('Cache-Control', 'public, max-age=300');
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (e: any) {
    return fail(res, 500, e.message);
  }
};