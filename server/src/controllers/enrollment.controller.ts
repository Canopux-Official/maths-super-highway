import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import Course from '../models/courses';
import Enrollment from '../models/enrollment';

// --- POST: Enroll in a Course ---
export const enrollInCourse = async (req: Request, res: Response) => {
  try {
    const { courseId} = req.body;
    const studentId = req.user?.userId; // Assuming user info is attached via auth middleware
    // const studentId = "69d751dce6d76e43e343808d";

    // 1. Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // 2. Create enrollment (Unique index in schema prevents duplicates)
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
    });

    return res.status(201).json({
      success: true,
      message: 'Enrolled successfully',
      data: enrollment,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this course' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- DELETE: Remove Enrollment (Unenroll) ---
export const unenrollFromCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user?.userId;
    // const studentId = "69d751dce6d76e43e343808d";

    const result = await Enrollment.findOneAndDelete({
      student: studentId,
      course: courseId,
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Enrollment record not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Unenrolled successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const checkEnrollment = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user?.userId; // replace with req.user?.id
 
    const enrollment = await Enrollment.findOne({
      student: new mongoose.Types.ObjectId(studentId),
      course: new mongoose.Types.ObjectId(courseId as any),
    });
 
    return res.status(200).json({
      success: true,
      enrolled: !!enrollment,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};