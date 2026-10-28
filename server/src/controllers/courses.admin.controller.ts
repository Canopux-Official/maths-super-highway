import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import Course, { MAX_DEPTH } from '../models/courses';
import Enrollment from '../models/enrollment';

const fail = (res: Response, status: number, message: string) =>
    res.status(status).json({ success: false, message });

const cleanTags = (tags: unknown): string[] =>
    Array.isArray(tags)
        ? [...new Set(tags.map((t) => String(t).trim()).filter(Boolean))].slice(0, 20)
        : [];

const toKey = (title: string) => title.trim().toLowerCase();

const nextOrder = async (parentId: Types.ObjectId | null) => {
    const last = await Course.findOne({ parentId }).sort({ order: -1 }).select('order').lean();
    return last ? last.order + 1 : 0;
};

const titleTaken = async (parentId: Types.ObjectId | null, title: string, excludeId?: string) => {
    const filter: any = { parentId, titleKey: toKey(title) };
    if (excludeId) filter._id = { $ne: excludeId };
    return !!(await Course.exists(filter));
};

// When a node that had no children gets its first child, students who ticked it
// keep their selection but it is flagged for review.
const flagIfWasLeaf = async (parentId: Types.ObjectId, previousChildCount: number) => {
    if (previousChildCount === 0) {
        await Enrollment.updateMany({ course: parentId }, { $set: { needsReview: true } });
    }
};

// GET /courses-admin/tree  -> flat, lean list of every node (client builds the tree)
export const getAdminTree = async (_req: Request, res: Response) => {
    try {
        const nodes = await Course.find()
            .select('title description tags parentId depth childCount order isActive updatedAt')
            .sort({ depth: 1, order: 1, _id: 1 })
            .lean();
        res.set('Cache-Control', 'private, no-cache'); // revalidate with ETag -> 304 when unchanged
        return res.status(200).json({ success: true, data: nodes });
    } catch (error: any) {
        return fail(res, 500, error.message);
    }
};

// GET /courses-admin/stats  -> { [leafId]: number of students who ticked it }
export const getSelectionCounts = async (_req: Request, res: Response) => {
    try {
        const rows = await Enrollment.aggregate([{ $group: { _id: '$course', count: { $sum: 1 } } }]);
        const data: Record<string, number> = {};
        rows.forEach((r) => (data[r._id.toString()] = r.count));
        res.set('Cache-Control', 'private, no-cache');
        return res.status(200).json({ success: true, data });
    } catch (error: any) {
        return fail(res, 500, error.message);
    }
};

// POST /courses-admin/create
export const createCourse = async (req: Request, res: Response) => {
    try {
        const { title, description, tags, parentId, isActive } = req.body;
        const parentObjectId: Types.ObjectId | null = parentId ? new Types.ObjectId(parentId) : null;

        let ancestors: Types.ObjectId[] = [];
        let depth = 0;
        if (parentObjectId) {
            const parent = await Course.findById(parentObjectId).lean();
            if (!parent) return fail(res, 404, 'Parent not found');
            if (parent.depth + 1 >= MAX_DEPTH) {
                return fail(res, 400, `Maximum depth of ${MAX_DEPTH} levels reached`);
            }
            ancestors = [...parent.ancestors, parent._id];
            depth = parent.depth + 1;
        }

        if (await titleTaken(parentObjectId, title)) {
            return fail(res, 409, 'A sibling with this name already exists');
        }

        const node = await Course.create({
            title,
            titleKey: toKey(title),
            description: description ?? '',
            tags: cleanTags(tags),
            parentId: parentObjectId,
            ancestors,
            depth,
            order: await nextOrder(parentObjectId),
            isActive: isActive ?? true,
        });

        if (parentObjectId) {
            const before = await Course.findByIdAndUpdate(parentObjectId, { $inc: { childCount: 1 } }, { new: false });
            if (before) await flagIfWasLeaf(parentObjectId, before.childCount);
        }

        return res.status(201).json({ success: true, data: node });
    } catch (error: any) {
        if (error.code === 11000) return fail(res, 409, 'A sibling with this name already exists');
        return fail(res, 500, error.message);
    }
};

// PATCH /courses-admin/update/:id   (title, description, tags, isActive)
export const updateCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, tags, isActive, expectedUpdatedAt } = req.body;

        const node = await Course.findById(id);
        if (!node) return fail(res, 404, 'Not found');

        // Two admins editing at once: reject if someone saved after this admin loaded the tree
        if (expectedUpdatedAt && node.updatedAt.getTime() !== new Date(expectedUpdatedAt).getTime()) {
            return fail(res, 409, 'This item was changed by someone else. Refresh and try again.');
        }

        if (title !== undefined && toKey(title) !== node.titleKey) {
            if (await titleTaken(node.parentId, title, id as string)) {
                return fail(res, 409, 'A sibling with this name already exists');
            }
            node.title = title.trim();
            node.titleKey = toKey(title);
        }
        if (description !== undefined) node.description = description;
        if (tags !== undefined) node.tags = cleanTags(tags);
        if (isActive !== undefined) node.isActive = isActive;

        await node.save();
        return res.status(200).json({ success: true, data: node });
    } catch (error: any) {
        if (error.code === 11000) return fail(res, 409, 'A sibling with this name already exists');
        return fail(res, 500, error.message);
    }
};

// PATCH /courses-admin/move/:id   body: { newParentId: string | null }
export const moveCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { newParentId } = req.body;

        const node = await Course.findById(id);
        if (!node) return fail(res, 404, 'Not found');

        const newParent = newParentId ? await Course.findById(newParentId) : null;
        if (newParentId && !newParent) return fail(res, 404, 'New parent not found');

        // Cannot move a node under itself or one of its own descendants
        if (newParent && (newParent._id.equals(node._id) || newParent.ancestors.some((a) => a.equals(node._id)))) {
            return fail(res, 400, 'Cannot move an item inside itself');
        }
        if (String(node.parentId ?? '') === String(newParent?._id ?? '')) {
            return fail(res, 400, 'Item is already under that parent');
        }
        if (await titleTaken(newParent ? newParent._id : null, node.title)) {
            return fail(res, 409, 'The new parent already has an item with this name');
        }

        const descendants = await Course.find({ ancestors: node._id }).select('ancestors depth').lean();
        const newDepth = newParent ? newParent.depth + 1 : 0;
        const delta = newDepth - node.depth;
        const deepest = Math.max(node.depth, ...descendants.map((d) => d.depth)) + delta;
        if (deepest >= MAX_DEPTH) return fail(res, 400, `Maximum depth of ${MAX_DEPTH} levels would be exceeded`);

        const newAncestors = newParent ? [...newParent.ancestors, newParent._id] : [];
        const oldParentId = node.parentId;
        const order = await nextOrder(newParent ? newParent._id : null);

        // One bulk write fixes the whole subtree
        const ops: any[] = [
            {
                updateOne: {
                    filter: { _id: node._id },
                    update: { $set: { parentId: newParent ? newParent._id : null, ancestors: newAncestors, depth: newDepth, order } },
                },
            },
            ...descendants.map((d) => {
                const tail = d.ancestors.slice(d.ancestors.findIndex((a) => a.equals(node._id)));
                return {
                    updateOne: {
                        filter: { _id: d._id },
                        update: { $set: { ancestors: [...newAncestors, ...tail], depth: d.depth + delta } },
                    },
                };
            }),
        ];
        await Course.bulkWrite(ops);

        if (oldParentId) await Course.updateOne({ _id: oldParentId }, { $inc: { childCount: -1 } });
        if (newParent) {
            const before = await Course.findByIdAndUpdate(newParent._id, { $inc: { childCount: 1 } }, { new: false });
            if (before) await flagIfWasLeaf(newParent._id, before.childCount);
        }

        return res.status(200).json({ success: true, message: 'Moved' });
    } catch (error: any) {
        return fail(res, 500, error.message);
    }
};

// PATCH /courses-admin/reorder/:id   body: { direction: 'up' | 'down' }
// export const reorderCourse = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const { direction } = req.body;

//         const node = await Course.findById(id).select('parentId').lean();
//         if (!node) return fail(res, 404, 'Not found');

//         const siblings = await Course.find({ parentId: node.parentId }).sort({ order: 1, _id: 1 }).select('_id').lean();
//         const ids = siblings.map((s) => s._id.toString());
//         const i = ids.indexOf(String(id));
//         const j = direction === 'up' ? i - 1 : i + 1;
//         if (j < 0 || j >= ids.length) return res.status(200).json({ success: true, message: 'Already at the edge' });

//         [ids[i], ids[j]] = [ids[j], ids[i]];
//         await Course.bulkWrite(
//             ids.map((sid, idx) => ({ updateOne: { filter: { _id: sid }, update: { $set: { order: idx } } } }))
//         );
//         return res.status(200).json({ success: true, message: 'Reordered' });
//     } catch (error: any) {
//         return fail(res, 500, error.message);
//     }
// };

// GET /courses-admin/delete-preview/:id  -> what a delete would remove
export const getDeletePreview = async (req: Request, res: Response) => {
    try {
        const oid = new Types.ObjectId(req.params.id as string);
        const ids = [oid, ...(await Course.find({ ancestors: oid }).distinct('_id'))];
        const selections = await Enrollment.countDocuments({ course: { $in: ids } });
        return res.status(200).json({ success: true, data: { nodes: ids.length, selections } });
    } catch (error: any) {
        return fail(res, 500, error.message);
    }
};

// DELETE /courses-admin/delete/:id  -> node + subtree + their enrollments
export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const node = await Course.findById(req.params.id);
        if (!node) return fail(res, 404, 'Not found');

        const ids = [node._id, ...(await Course.find({ ancestors: node._id }).distinct('_id'))];
        const enr = await Enrollment.deleteMany({ course: { $in: ids } });
        await Course.deleteMany({ _id: { $in: ids } });
        if (node.parentId) await Course.updateOne({ _id: node.parentId }, { $inc: { childCount: -1 } });

        return res.status(200).json({
            success: true,
            message: `Deleted ${ids.length} item(s) and ${enr.deletedCount} student selection(s)`,
        });
    } catch (error: any) {
        return fail(res, 500, error.message);
    }
};

// GET /courses-admin/enrolled-students/:id -> distinct students under this node (leaf or parent)
export const getEnrolledStudentsExport = async (req: Request, res: Response): Promise<void> => {
    try {
        const oid = new mongoose.Types.ObjectId(req.params.id as string);
        const ids = [oid, ...(await Course.find({ ancestors: oid }).distinct('_id'))];

        const result = await Enrollment.aggregate([
            { $match: { course: { $in: ids } } },
            { $group: { _id: '$student', selectedAt: { $min: '$createdAt' } } },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $lookup: { from: 'targetexams', localField: 'user.targetExams', foreignField: '_id', as: 'targetExamsDetails' } },
            {
                $project: {
                    _id: '$user._id',
                    name: '$user.name',
                    email: '$user.email',
                    phone: '$user.phone',
                    role: '$user.role',
                    isActive: '$user.isActive',
                    createdAt: '$user.createdAt',
                    selectedAt: 1,
                    targetExams: '$targetExamsDetails',
                },
            },
        ]);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        console.error('getEnrolledStudentsExport error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};