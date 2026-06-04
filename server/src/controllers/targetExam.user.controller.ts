import { Request, Response } from 'express';
import TargetExam from '../models/targetExam';

export const getActiveTargetExams = async (req: Request, res: Response) => {
  try {
    const exams = await TargetExam.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ success: true, data: exams });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
