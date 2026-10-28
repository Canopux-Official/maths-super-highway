import Course from "../models/courses";
import Enrollment from "../models/enrollment";
import Headline from "../models/headline";
import { Request, Response } from 'express';

// Landing testimonials now live in testimonial.controller.ts (admin-approved + 4.5 average rule)
import { computeNodeStats } from './testimonial.controller';
export { getLandingPageTestimonials } from './testimonial.controller';

// GET /landing-page/curriculum  (public)
// Every topic a visitor may see, in one flat list, with 3 public numbers per item:
//   students = different students who selected it or anything inside it
//   rating / reviews = average and count of reviews on it or anything inside it
// A topic is visible if it and all its parents are active.
export const getLandingCurriculum = async (_req: Request, res: Response) => {
  try {
    const [nodes, enrollments, stats] = await Promise.all([
      Course.find()
        .select('title description parentId ancestors order isActive')
        .sort({ depth: 1, order: 1, _id: 1 })
        .lean(),
      Enrollment.find().select('student course').lean(),
      computeNodeStats(),
    ]);

    const inactive = new Set(nodes.filter((n) => !n.isActive).map((n) => n._id.toString()));
    const visible = nodes.filter((n) => n.isActive && !n.ancestors.some((a) => inactive.has(a.toString())));
    const byId = new Map(visible.map((n) => [n._id.toString(), n]));

    // distinct students per topic, counting every parent above it too
    const studentsOf = new Map<string, Set<string>>();
    const addStudent = (id: string, student: string) => {
      let set = studentsOf.get(id);
      if (!set) studentsOf.set(id, (set = new Set()));
      set.add(student);
    };
    enrollments.forEach((e) => {
      const node = byId.get(e.course.toString());
      if (!node) return; // hidden or deleted topic
      const student = e.student.toString();
      addStudent(node._id.toString(), student);
      node.ancestors.forEach((a) => addStudent(a.toString(), student));
    });

    const data = visible.map((n) => {
      const id = n._id.toString();
      const r = stats.all.get(id);
      return {
        _id: n._id,
        title: n.title,
        description: n.description,
        parentId: n.parentId,
        order: n.order,
        students: studentsOf.get(id)?.size ?? 0,
        reviews: r?.count ?? 0,
        rating: r && r.count ? Math.round((r.sum / r.count) * 10) / 10 : 0,
      };
    });

    res.set('Cache-Control', 'public, max-age=300'); // up to 5 minutes behind the admin screen
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getHeadlines = async (_req: Request, res: Response) => {
  try {
    const headlines = await Headline.find({ isActive: true }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: headlines });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};