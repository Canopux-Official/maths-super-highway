import { Request, Response } from 'express';
import Headline from '../models/headline';

// 1. Create Headline
export const createHeadline = async (req: Request, res: Response) => {
  try {
    const { text, link, isLive } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: "Headline text is required" });
    }

    // Check for duplicates: See if this exact text already exists
    const existingHeadline = await Headline.findOne({ 
      text: { $regex: new RegExp(`^${text.trim()}$`, 'i') } 
    });

    if (existingHeadline) {
      return res.status(400).json({ 
        success: false, 
        message: "This headline already exists. Try updating the existing one instead." 
      });
    }

    const headline = await Headline.create({
      text: text.trim(),
      link,
      isLive: isLive ?? true
    });

    return res.status(201).json({
      success: true,
      message: "Headline created successfully",
      data: headline
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Update Headline
export const updateHeadline = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text, link, isLive } = req.body;

    // If text is being updated, check if the new text collides with another headline
    if (text) {
      const duplicate = await Headline.findOne({
        _id: { $ne: id }, // Not this current headline
        text: { $regex: new RegExp(`^${text.trim()}$`, 'i') }
      });

      if (duplicate) {
        return res.status(400).json({ 
          success: false, 
          message: "Another headline already uses this text." 
        });
      }
    }

    const updatedHeadline = await Headline.findByIdAndUpdate(
      id,
      { $set: { text, link, isLive } },
      { new: true, runValidators: true }
    );

    if (!updatedHeadline) {
      return res.status(404).json({ success: false, message: "Headline not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Headline updated successfully",
      data: updatedHeadline
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Remove Headline
export const deleteHeadline = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedHeadline = await Headline.findByIdAndDelete(id);

    if (!deletedHeadline) {
      return res.status(404).json({ success: false, message: "Headline not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Headline removed successfully"
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Get Live Headlines (For User View)
export const getHeadlines = async (_req: Request, res: Response) => {
  try {
    const headlines = await Headline.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: headlines });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};