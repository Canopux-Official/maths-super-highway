import { Request, Response } from 'express';
import Course from '../models/courses';
import Enrollment from '../models/enrollment';
import Testimonial from '../models/testimonials';

// 1. Get children (Same drill-down logic as admin but filtered by isActive)
export const getUserSubItems = async (req: Request, res: Response) => {
  try {
    const { parentId } = req.params;
    const query = parentId === 'root' ? null : parentId;

    const items = await Course.find({ parentId: query, isActive: true }).sort({ order: 1 });

    return res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Leaf Node Details + Social Proof + Testimonials
export const getUserPageDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Fetch Page Content
    const page = await Course.findById(id);
    if (!page || !page.isActive) {
      return res.status(404).json({ success: false, message: 'Course page not found' });
    }

    // 2. Fetch Enrollment Count (Social Proof)
    const enrollmentCount = await Enrollment.countDocuments({ course: id });

    // 3. Fetch Testimonials
    const testimonials = await Testimonial.find({ course: id })
      .populate('user', 'name') // Only show reviewer name
      .sort({ createdAt: -1 })
      .limit(10); // Latest 10 reviews

    return res.status(200).json({
      success: true,
      data: {
        content: page.content,
        title: page.title,
        stats: {
          enrolledCount: enrollmentCount
        },
        testimonials
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyEnrolledCourses = async (req: Request, res: Response) => {
  try {
    // 1. Get user ID from the request (assumes you have an auth middleware)
    // const userId = req.user?._id; 
    const {userId} = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    // 2. Find all enrollments for this user
    // We populate 'course' to get the Title, Content, and Type
    const enrollments = await Enrollment.find({ student: userId })
      .populate({
        path: 'course',
        select: 'title content itemType parentId createdAt', // Exclude isActive if needed
      })
      .sort({ createdAt: -1 }) // Show most recent enrollments first
      .lean();

    // 3. Extract the course objects for a cleaner response
    const enrolledCourses = enrollments
      .filter(e => e.course !== null) // Safety check in case a course was deleted
      .map(e => e.course);

    return res.status(200).json({
      success: true,
      message: "Enrolled courses fetched successfully",
      count: enrolledCourses.length,
      data: enrolledCourses
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch enrolled courses", 
      error: error.message 
    });
  }
};