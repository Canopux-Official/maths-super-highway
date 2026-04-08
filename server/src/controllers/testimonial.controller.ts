import { Request, Response } from 'express';
import Testimonial from '../models/testimonials';

// 1. Create Testimonial
export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const { courseId, rating, message, userId } = req.body;
    // const userId = req.user?._id; // Use this with Auth Middleware

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
    const { rating, message, userId } = req.body;

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
    const { userId, userRole } = req.body; // Assume role comes from middleware

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


export const getLandingPageTestimonials = async (req: Request, res: Response) => {
  try {
    // 1. Fetch top testimonials (e.g., only 4 and 5 stars)
    // 2. Limit to 6 or 9 so the landing page grid looks even
    // 3. Populate user (to show who said it) and course (to show what they studied)
    const testimonials = await Testimonial.find({ rating: { $gte: 4 } })
      .populate('user', 'name') 
      .populate('course', 'title')
      .sort({ createdAt: -1 }) // Get the freshest ones first
      .limit(6)
      .lean();

    return res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: "Could not fetch testimonials for landing page",
      error: error.message 
    });
  }
};