import { Request, Response, NextFunction } from 'express';
import mongoose, { Types } from 'mongoose';
import Course, { ICourse } from '../models/courses';
import Enrollment from '../models/enrollment';
import cloudinary from '../config/cloudinary';
import axios from 'axios';

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

const collectDescendantIdsAndImages = async (parentId: Types.ObjectId): Promise<{ ids: Types.ObjectId[], publicIds: string[] }> => {
    const children = await Course.find({ parentId }).select('_id thumbnail').lean();

    let ids: Types.ObjectId[] = children.map((c) => c._id as Types.ObjectId);
    let publicIds: string[] = children
        .filter((c: any) => c.thumbnail && c.thumbnail.publicId)
        .map((c: any) => c.thumbnail.publicId);

    for (const child of children) {
        const nested = await collectDescendantIdsAndImages(child._id as Types.ObjectId);
        ids.push(...nested.ids);
        publicIds.push(...nested.publicIds);
    }
    return { ids, publicIds };
};

// Retaining old helper signature just in case it's used elsewhere, pointing it to the new robust version
const collectDescendantIds = async (parentId: Types.ObjectId): Promise<Types.ObjectId[]> => {
    const result = await collectDescendantIdsAndImages(parentId);
    return result.ids;
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
// UPDATED: Now expects a thumbnail object containing { url, publicId } from request body
export const createCourse = async (req: Request, res: Response) => {
    try {
        const { title, content, parentId, itemType, thumbnail } = req.body;

        if (parentId) {
            const parent = await Course.findById(parentId);
            if (!parent) {
                return res.status(404).json({ success: false, message: 'Parent course not found' });
            }

            const allowedChildren: Record<string, string[]> = {
                folder: ['folder', 'page'],
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
            thumbnail: thumbnail ?? { url: '', publicId: '' } // Save thumbnail reference
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

// use to upload images
export const uploadCourseImage = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'No image file provided' });
            return;
        }

        // multer-storage-cloudinary attaches these to req.file
        const file = req.file as Express.Multer.File & {
            path: string; // Cloudinary secure_url
            filename: string; // Cloudinary public_id
        };

        res.status(200).json({
            success: true,
            url: file.path,      // Cloudinary secure_url — insert as <img src>
            publicId: file.filename,  // Cloudinary public_id — needed to delete later
        });
    } catch (error: any) {
        console.error('uploadCourseImage error:', error);
        res.status(500).json({ success: false, message: error.message ?? 'Upload failed' });
    }
};


// use to delete the images
export const deleteCourseImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const publicId = decodeURIComponent(req.params.publicId as any);

        if (!publicId) {
            res.status(400).json({ success: false, message: 'publicId is required' });
            return;
        }

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'image',
            invalidate: true, // purge from Cloudinary CDN cache
        });

        // result.result is 'ok' on success, 'not found' if already deleted
        if (result.result === 'ok') {
            res.status(200).json({ success: true, message: 'Image deleted' });
        } else if (result.result === 'not found') {
            // Treat as success — idempotent delete
            res.status(200).json({ success: true, message: 'Image not found (already deleted)' });
        } else {
            res.status(500).json({ success: false, message: `Cloudinary returned: ${result.result}` });
        }
    } catch (error: any) {
        console.error('deleteCourseImage error:', error);
        res.status(500).json({ success: false, message: error.message ?? 'Delete failed' });
    }
};

// PATCH /api/courses/:id
export const updateCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content, parentId, itemType, thumbnail } = req.body;

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

        // If a new thumbnail is supplied and it's different from the current one, clean up the old one from Cloudinary
        const existingThumbnail = (existing as any).thumbnail;
        if (thumbnail && existingThumbnail && existingThumbnail.publicId && existingThumbnail.publicId !== thumbnail.publicId) {
            try {
                await cloudinary.uploader.destroy(existingThumbnail.publicId, { resource_type: 'image', invalidate: true });
            } catch (cloudErr) {
                console.error(`Failed to delete orphaned image ${existingThumbnail.publicId}:`, cloudErr);
            }
        }

        const updated = await Course.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...(title !== undefined && { title }),
                    ...(content !== undefined && { content }),
                    ...(itemType !== undefined && { itemType }),
                    ...(thumbnail !== undefined && { thumbnail }),
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

        // 1. Gather all descendant database IDs and their Cloudinary image public IDs
        //  Fixed Line (Notice the colon syntax `publicIds: publicIdsToClean`)
        const { ids: descendantIds, publicIds: publicIdsToClean } = await collectDescendantIdsAndImages(existing._id as Types.ObjectId);
        const allCourseIds = [existing._id as Types.ObjectId, ...descendantIds];

        // Include the target root course's image if it has one
        const rootThumbnail = (existing as any).thumbnail;
        if (rootThumbnail && rootThumbnail.publicId) {
            publicIdsToClean.push(rootThumbnail.publicId);
        }

        // 2. Clean up files from Cloudinary storage asynchronously
        if (publicIdsToClean.length > 0) {
            // Using Promise.allSettled guarantees that even if one cloud image fail fails, it won't crash the database deletion process.
            await Promise.allSettled(
                publicIdsToClean.map(publicId =>
                    cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true })
                )
            );
        }

        // 3. Remove records from MongoDB
        await Course.deleteMany({ _id: { $in: allCourseIds } });

        return res.status(200).json({
            success: true,
            message: `Deleted ${allCourseIds.length} item(s) and associated media successfully`,
            data: { deletedCount: allCourseIds.length },
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/courses/enrolled-students/:id
export const getEnrolledStudentsExport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id as any)) {
            res.status(400).json({ success: false, message: 'Invalid course ID' });
            return;
        }

        const objectId = new mongoose.Types.ObjectId(id as any);

        const result = await Course.aggregate([
            // 1. Match the target course item
            { $match: { _id: objectId } },

            // 2. Recursively find ALL descendants in one query
            {
                $graphLookup: {
                    from: 'courses',
                    startWith: '$_id',
                    connectFromField: '_id',
                    connectToField: 'parentId',
                    as: 'descendants',
                    restrictSearchWithMatch: { isActive: true }
                }
            },

            // 3. Build the final list of page IDs to query enrollments against:
            {
                $project: {
                    itemType: 1,
                    pageIds: {
                        $cond: {
                            if: { $eq: ['$itemType', 'page'] },
                            then: ['$_id'],
                            else: {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: '$descendants',
                                            as: 'desc',
                                            cond: { $eq: ['$$desc.itemType', 'page'] }
                                        }
                                    },
                                    as: 'page',
                                    in: '$$page._id'
                                }
                            }
                        }
                    }
                }
            },

            // 4. Join with enrollments
            {
                $lookup: {
                    from: 'enrollments',
                    localField: 'pageIds',
                    foreignField: 'course',
                    as: 'enrollments'
                }
            },

            // 5. Flatten the enrollments
            { $unwind: '$enrollments' },

            // 6. Group to get unique students
            {
                $group: {
                    _id: '$enrollments.student'
                }
            },

            // 7. Lookup user details
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },

            // 8. Lookup target exams for the user
            {
                $lookup: {
                    from: 'targetexams',
                    localField: 'user.targetExams',
                    foreignField: '_id',
                    as: 'targetExamsDetails'
                }
            },

            // 9. Format output
            {
                $project: {
                    _id: '$user._id',
                    name: '$user.name',
                    email: '$user.email',
                    phone: '$user.phone',
                    role: '$user.role',
                    isActive: '$user.isActive',
                    createdAt: '$user.createdAt',
                    targetExams: '$targetExamsDetails'
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error('getEnrolledStudentsExport error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


export const streamDrivePdf = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { fileId } = req.params;

        if (!fileId) {
            res.status(400).json({
                success: false,
                message: 'fileId is required'
            });
            return;
        }

        const driveUrl =
            `https://drive.google.com/uc?export=download&id=${fileId}`;

        const response = await axios({
            method: 'GET',
            url: driveUrl,
            responseType: 'stream',
            timeout: 30000,
            maxRedirects: 5,
            validateStatus: (status) =>
                status >= 200 && status < 400
        });

        res.setHeader(
            'Content-Type',
            String(response.headers['content-type'] || 'application/pdf')
        );

        const contentLength = response.headers['content-length'];
        if (contentLength) {
            res.setHeader('Content-Length', String(contentLength));
        }

        res.setHeader(
            'Cache-Control',
            'public, max-age=3600'
        );

        response.data.pipe(res);

        response.data.on('error', (err: Error) => {
            console.error('PDF stream error:', err);

            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to stream PDF'
                });
            }
        });
    } catch (error: any) {
        console.error('streamDrivePdf error:', error);

        if (error.code === 'ECONNABORTED') {
            res.status(504).json({
                success: false,
                message: 'Google Drive timeout'
            });
            return;
        }

        if (error.response?.status === 404) {
            res.status(404).json({
                success: false,
                message: 'File not found'
            });
            return;
        }

        if (error.response?.status === 403) {
            res.status(403).json({
                success: false,
                message:
                    'Google Drive denied access. Make sure the file is public.'
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'Unable to fetch PDF'
        });
    }
};