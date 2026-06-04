import { Request, Response } from 'express';
import TargetExam from '../models/targetExam';

export const getTargetExams = async (req: Request, res: Response) => {
  try {
    const exams = await TargetExam.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: exams });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTargetExam = async (req: Request, res: Response) => {
  try {
    const { name, isActive } = req.body;
    const exists = await TargetExam.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Target exam already exists' });
    }
    const exam = await TargetExam.create({ name, isActive });
    res.status(201).json({ success: true, data: exam });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTargetExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;
    
    const exam = await TargetExam.findByIdAndUpdate(
      id,
      { $set: { name, isActive } },
      { new: true, runValidators: true }
    );
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Target exam not found' });
    }
    res.status(200).json({ success: true, data: exam });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTargetExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exam = await TargetExam.findByIdAndDelete(id);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Target exam not found' });
    }
    res.status(200).json({ success: true, message: 'Target exam deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
