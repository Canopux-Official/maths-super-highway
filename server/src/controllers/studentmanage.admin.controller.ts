import { Request, Response } from 'express';
import User from '../models/user';

/**
 * @desc    Get all users (Typically filtered for the Admin view)
 * @route   GET /api/users
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // We fetch all users except sensitive data like passwords
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update user profile (Phone, DOB, and Status)
 * @route   PUT /api/users/:id
 */
export const updateUserByAdmin = async (req: Request, res: Response) => {
  try {
    const {isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        $set: {
          isActive 
        } 
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};