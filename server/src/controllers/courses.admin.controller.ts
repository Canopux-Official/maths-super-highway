import { Request, Response, NextFunction } from 'express';
import mongoose, { Types } from 'mongoose';
import Course, { ICourse } from '../models/courses';
import Enrollment from '../models/enrollment';

// --- Interfaces for Standardized Responses ---

interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
}

// --- Helpers ---

const buildTree = (items: ICourse[], parentId: Types.ObjectId | null = null): object[] => {
    return items
        .filter((item) =>
            parentId === null
                ? item.parentId === null
                : item.parentId?.toString() === parentId.toString()
        )
        .map((item) => {
            const node = (item.toObject ? item.toObject() : item) as any;
            node.children = buildTree(items, item._id as Types.ObjectId);
            return node;
        });
};

const collectDescendantIds = async (parentId: Types.ObjectId): Promise<Types.ObjectId[]> => {
    const children = await Course.find({ parentId }).select('_id').lean();
    const ids: Types.ObjectId[] = children.map((c) => c._id as Types.ObjectId);
    for (const child of children) {
        const nested = await collectDescendantIds(child._id as Types.ObjectId);
        ids.push(...nested);
    }
    return ids;
};

// --- Controllers ---

export const getAdminSubItems = async (req: Request, res: Response) => {
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

export const getAdminPageDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // 1. Basic check for the course
        const page = await Course.findById(id);
        if (!page) return res.status(404).json({ success: false, message: 'Page not found' });

        // 2. Use Aggregation instead of find().populate()
        const enrollmentsWithStudents = await Enrollment.aggregate([
            {
                // Filter for this specific course ID
                $match: { course: new mongoose.Types.ObjectId(id as any) }
            },
            {
                // Perform the "JOIN" with the users collection
                $lookup: {
                    from: 'users',           // The ACTUAL name of the collection in MongoDB (usually lowercase plural)
                    localField: 'student',   // The field in Enrollment
                    foreignField: '_id',     // The field in User
                    as: 'studentDetails'     // Where to put the result
                }
            },
            {
                // Since lookup returns an array, turn it into a single object
                $unwind: '$studentDetails'
            },
            {
                // Shape the output to match what you want
                $project: {
                    _id: 0,
                    name: '$studentDetails.name',
                    email: '$studentDetails.email',
                    phone: '$studentDetails.phone'
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: {
                details: page,
                enrolledStudents: enrollmentsWithStudents
            }
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/courses
export const createCourse = async (req: Request, res: Response) => {
    try {
        const { title, content, parentId, itemType } = req.body;

        if (parentId) {
            const parent = await Course.findById(parentId);
            if (!parent) {
                return res.status(404).json({ success: false, message: 'Parent course not found' });
            }

            const allowedChildren: Record<string, string[]> = {
                // A Folder can hold other Folders or final Pages (Infinite Nesting)
                folder: ['folder', 'page'],

                // A Page is a leaf node; it cannot have children
                page: [],
            };

            const childType = itemType ?? 'folder';
            if (!allowedChildren[parent.itemType as string].includes(childType)) {
                return res.status(400).json({
                    success: false,
                    message: `A "${parent.itemType}" cannot contain a child of type "${childType}"`,
                });
            }
        }

        const course = await Course.create({
            title,
            content,
            parentId: parentId ?? null,
            itemType,
        });

        return res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: course,
        });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// PATCH /api/courses/:id
export const updateCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content, parentId, itemType } = req.body;

        const existing = await Course.findById(id);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        if (parentId && parentId === id) {
            return res.status(400).json({ success: false, message: 'A course cannot be its own parent' });
        }

        if (parentId) {
            const newParent = await Course.findById(parentId);
            if (!newParent) {
                return res.status(404).json({ success: false, message: 'New parent course not found' });
            }

            const descendants = await collectDescendantIds(existing._id as Types.ObjectId);
            if (descendants.some((did) => did.toString() === parentId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot move a course under one of its own descendants',
                });
            }
        }

        const updated = await Course.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...(title !== undefined && { title }),
                    ...(content !== undefined && { content }),
                    ...(itemType !== undefined && { itemType }),
                    parentId: parentId !== undefined ? (parentId ?? null) : existing.parentId,
                },
            },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            data: updated,
        });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE /api/courses/:id
export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const existing = await Course.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const descendants = await collectDescendantIds(existing._id as Types.ObjectId);
        const allIds = [existing._id as Types.ObjectId, ...descendants];

        await Course.deleteMany({ _id: { $in: allIds } });

        return res.status(200).json({
            success: true,
            message: `Deleted ${allIds.length} item(s) successfully`,
            data: { deletedCount: allIds.length },
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};