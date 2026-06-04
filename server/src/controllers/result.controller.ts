import { Request, Response } from 'express';
import Result from '../models/result';
import cloudinary from '../config/cloudinary';

// Public endpoint for Landing Page
export const getActiveResults = async (req: Request, res: Response) => {
  try {
    const results = await Result.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: results });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin endpoint for Management Page
export const getAllResults = async (req: Request, res: Response) => {
  try {
    const results = await Result.find({}).sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: results });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin endpoint to upload and create Result
export const createResult = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const { title, isActive, order } = req.body;
    
    // multer-storage-cloudinary adds `path` (the url) and `filename` (the public_id)
    const imageUrl = req.file.path;
    const publicId = req.file.filename;

    const result = await Result.create({
      imageUrl,
      publicId,
      title: title || '',
      isActive: isActive !== 'false',
      order: order ? parseInt(order, 10) : 0,
    });

    return res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin endpoint to update Result
export const updateResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, isActive, order } = req.body;

    const result = await Result.findByIdAndUpdate(
      id,
      { title, isActive, order },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin endpoint to delete Result
export const deleteResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await Result.findById(id);

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(result.publicId);

    // Delete from Database
    await result.deleteOne();

    return res.status(200).json({ success: true, message: 'Result deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
