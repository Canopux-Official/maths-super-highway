import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import Course from '../models/courses';
import Enrollment from '../models/enrollment';

const fail = (res: Response, status: number, message: string) =>
  res.status(status).json({ success: false, message });

// GET /courses-user/tree -> flat list of everything a student may see.
// A node is hidden if it, or any ancestor, is inactive.
export const getUserTree = async (_req: Request, res: Response) => {
  try {
    const all = await Course.find()
      .select('title description tags parentId ancestors depth childCount order isActive')
      .sort({ depth: 1, order: 1, _id: 1 })
      .lean();

    const inactive = new Set(all.filter((n) => !n.isActive).map((n) => n._id.toString()));
    const data = all
      .filter((n) => n.isActive && !n.ancestors.some((a) => inactive.has(a.toString())))
      .map(({ ancestors, isActive, ...rest }) => rest);

    res.set('Cache-Control', 'private, no-cache'); // ETag -> 304 on repeat visits
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return fail(res, 500, error.message);
  }
};

// GET /courses-user/my-selections -> [{ courseId, needsReview }]
export const getMySelections = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return fail(res, 401, 'Unauthorized access');

    const rows = await Enrollment.find({ student: new Types.ObjectId(userId) })
      .select('course needsReview')
      .lean();
    return res.status(200).json({
      success: true,
      data: rows.map((r) => ({ courseId: r.course.toString(), needsReview: !!r.needsReview })),
    });
  } catch (error: any) {
    return fail(res, 500, error.message);
  }
};

// POST /courses-user/selections  body: { add?: string[], remove?: string[] }
// Idempotent: safe to repeat. Only active leaves can be added.
export const updateMySelections = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId; // always from the token, never from the URL/body
    if (!userId) return fail(res, 401, 'Unauthorized access');
    const student = new Types.ObjectId(userId);

    const valid = (v: unknown): Types.ObjectId[] =>
      Array.isArray(v) ? [...new Set(v.map(String))].filter(mongoose.isValidObjectId).slice(0, 500).map((x) => new Types.ObjectId(x)) : [];

    const addIds = valid(req.body.add);
    const removeIds = valid(req.body.remove);

    let rejected = 0;
    if (addIds.length) {
      const candidates = await Course.find({ _id: { $in: addIds }, childCount: 0, isActive: true })
        .select('ancestors')
        .lean();
      const ancestorIds = [...new Set(candidates.flatMap((c) => c.ancestors.map(String)))];
      const inactiveAncestors = new Set(
        (await Course.find({ _id: { $in: ancestorIds }, isActive: false }).select('_id').lean()).map((a) => a._id.toString())
      );
      const ok = candidates.filter((c) => !c.ancestors.some((a) => inactiveAncestors.has(a.toString())));
      rejected = addIds.length - ok.length;

      if (ok.length) {
        await Enrollment.bulkWrite(
          ok.map((c) => ({
            updateOne: {
              filter: { student, course: c._id },
              update: { $setOnInsert: { student, course: c._id, needsReview: false } },
              upsert: true,
            },
          }))
        );
      }
    }
    if (removeIds.length) {
      await Enrollment.deleteMany({ student, course: { $in: removeIds } });
    }

    return res.status(200).json({ success: true, rejected });
  } catch (error: any) {
    return fail(res, 500, error.message);
  }
};

// PATCH /courses-user/selections/:id/reviewed -> student confirms a "needs review" selection
export const markReviewed = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return fail(res, 401, 'Unauthorized access');
    await Enrollment.updateOne(
      { student: new Types.ObjectId(userId), course: new Types.ObjectId(req.params.id as string) },
      { $set: { needsReview: false } }
    );
    return res.status(200).json({ success: true });
  } catch (error: any) {
    return fail(res, 500, error.message);
  }
};

// GET /courses-*/enrolled-count/:id -> distinct students who ticked this node or anything under it
export const getEnrolledCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id as any)) {
      res.status(400).json({ success: false, message: 'Invalid course ID' });
      return;
    }
    const oid = new mongoose.Types.ObjectId(id as any);
    const node = await Course.findById(oid).select('childCount').lean();
    if (!node) {
      res.status(404).json({ success: false, message: 'Course item not found' });
      return;
    }
    const ids = [oid, ...(await Course.find({ ancestors: oid }).distinct('_id'))];
    const students = await Enrollment.distinct('student', { course: { $in: ids } });
    res.status(200).json({
      success: true,
      data: { courseId: id, isLeaf: node.childCount === 0, enrolledCount: students.length },
    });
  } catch (error) {
    console.error('getEnrolledCount error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};