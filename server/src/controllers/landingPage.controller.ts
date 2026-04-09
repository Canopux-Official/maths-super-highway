import Course from "../models/courses";
import Headline from "../models/headline";
import Testimonial from "../models/testimonials";
import { Request, Response } from 'express';

export const getLandingPageTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await Testimonial.aggregate([
      // 1. Filter for top ratings (4 and 5 stars)
      {
        $match: { rating: { $gte: 4 } }
      },
      // 2. Sort by newest first
      {
        $sort: { createdAt: -1 }
      },
      // 3. Limit to 6 for the grid
      {
        $limit: 6
      },
      // 4. Join with Users collection
      {
        $lookup: {
          from: 'users',           // Check your DB - usually lowercase plural
          localField: 'user',      // Field in Testimonial
          foreignField: '_id',     // Field in User
          as: 'user'
        }
      },
      // 5. Join with Courses collection
      {
        $lookup: {
          from: 'courses',         // Check your DB - usually lowercase plural
          localField: 'course',    // Field in Testimonial
          foreignField: '_id',     // Field in Course
          as: 'course'
        }
      },
      // 6. Convert the joined arrays into single objects
      { $unwind: '$user' },
      { $unwind: '$course' },
      // 7. Project only the fields you need for the UI
      {
        $project: {
          rating: 1,
          comment: 1,
          message: 1,
          createdAt: 1,
          'user.name': 1,
          'course.title': 1
        }
      }
    ]);

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


export const getCourses = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // If parentId is 'root', we look for null
        const query = id === 'root' ? null : id;

        const items = await Course.find({ parentId: query }).sort({ order: 1 });

        return res.status(200).json({
            success: true,
            data: items
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getHeadlines = async (_req: Request, res: Response) => {
  try {
    const headlines = await Headline.find({isActive : true}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: headlines });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};