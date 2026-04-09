import { Request, Response } from 'express';
import Testimonial from '../models/testimonials';
import mongoose from 'mongoose';

// 1. Create Testimonial
export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const { courseId, rating, message } = req.body;
    // const userId = req.user?._id; // Use this with Auth Middleware
    const userId = "69d751dce6d76e43e343808d";

    // Check if the user already reviewed this course
    const existing = await Testimonial.findOne({ user: userId, course: courseId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this course. Please update your existing review."
      });
    }

    const testimonial = await Testimonial.create({
      user: userId,
      course: courseId,
      rating,
      message
    });

    return res.status(201).json({ success: true, data: testimonial });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Update Testimonial (Optional - restricted to the owner)
export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, message } = req.body;
    const userId = "69d751dce6d76e43e343808d";

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Security: Check if the user trying to update is the owner
    if (testimonial.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "You can only edit your own reviews" });
    }

    testimonial.rating = rating ?? testimonial.rating;
    testimonial.message = message ?? testimonial.message;
    await testimonial.save();

    return res.status(200).json({ success: true, message: "Review updated", data: testimonial });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Delete Testimonial
export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {userRole } = req.body; // Assume role comes from middleware
    const userId = "69d751dce6d76e43e343808d";

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Logic: Admins can delete ANY review, Students can only delete THEIR OWN
    if (userRole !== 'admin' && testimonial.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this review" });
    }

    await testimonial.deleteOne();

    return res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};





export const getMyTestimonialForCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = "69d751dce6d76e43e343808d"; // replace with req.user?.id
 
    const testimonial = await Testimonial.findOne({
      user: new mongoose.Types.ObjectId(userId),
      course: new mongoose.Types.ObjectId(courseId as any),
    });
 
    return res.status(200).json({
      success: true,
      data: testimonial || null,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
 
export const getPageTestimonialsPaginated = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
 
    const testimonials = await Testimonial.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(id as any) } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          rating: 1,
          comment: 1,
          message: 1,
          createdAt: 1,
          "user.name": "$userDetails.name",
        },
      },
    ]);
 
    return res.status(200).json({ success: true, data: testimonials });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};