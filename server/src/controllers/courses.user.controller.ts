import { Request, Response } from 'express';
import Course from '../models/courses';
import Enrollment from '../models/enrollment';
import Testimonial from '../models/testimonials';
import mongoose from 'mongoose';

// 1. Get children (Same drill-down logic as admin but filtered by isActive)
export const getUserSubItems = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = id === 'root' ? null : id;

    const items = await Course.find({ parentId: query, isActive: true }).sort({ order: 1 });

    return res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserPageDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Fetch Page Content
    const page = await Course.findById(id);
    if (!page || !page.isActive) {
      return res.status(404).json({ success: false, message: 'Course page not found' });
    }

    // 2. Fetch Enrollment Count
    const enrollmentCount = await Enrollment.countDocuments({ course: new mongoose.Types.ObjectId(id as any) });

    // 3. Fetch Testimonials using Aggregate (instead of populate)
    const testimonials = await Testimonial.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(id as any) } },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users', // The collection name for your User model
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          rating: 1,
          comment: 1,
          message: 1,
          createdAt: 1,
          'user.name': '$userDetails.name' // Flatten name to match your expected structure
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        content: page.content,
        title: page.title,
        stats: { enrolledCount: enrollmentCount },
        testimonials
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyEnrolledCourses = async (req: Request, res: Response) => {
  try {
    // const { userId } = req.body;
    // const userId = req.user?.id; // Assuming you have authentication middleware that sets req.user
    const userId = "69d751dce6d76e43e343808d";

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const enrolledCourses = await Enrollment.aggregate([
      // 1. Filter by student ID
      { $match: { student: new mongoose.Types.ObjectId(userId) } },
      // 2. Join with Courses collection
      {
        $lookup: {
          from: 'courses', // The collection name for your Course model
          localField: 'course',
          foreignField: '_id',
          as: 'courseDetails'
        }
      },
      // 3. Flatten the array
      { $unwind: '$courseDetails' },
      // 4. Sort by enrollment date
      { $sort: { createdAt: -1 } },
      // 5. Select only the fields you want from the course
      {
        $project: {
          _id: '$courseDetails._id',
          title: '$courseDetails.title',
          content: '$courseDetails.content',
          itemType: '$courseDetails.itemType',
          parentId: '$courseDetails.parentId',
          createdAt: '$courseDetails.createdAt'
        }
      }
    ]);

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