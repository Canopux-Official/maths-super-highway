import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export const MAX_DEPTH = 6; // levels 0..5

export interface ICourse extends Document {
    _id: Types.ObjectId;
    title: string;
    titleKey: string;            // lower-case title, used for the "no duplicate siblings" rule
    description: string;
    tags: string[];              // free text, e.g. "HL", "SL", "BC only", "IA", "15 h"
    parentId: Types.ObjectId | null;
    ancestors: Types.ObjectId[]; // path from the top: [grandparent, parent]
    depth: number;               // 0 = programme / board
    childCount: number;          // 0 means "leaf"
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        titleKey: { type: String, required: true },
        description: { type: String, default: '', maxlength: 5000 },
        tags: { type: [String], default: [] },
        parentId: { type: Schema.Types.ObjectId, ref: 'Course', default: null },
        ancestors: { type: [Schema.Types.ObjectId], default: [], index: true },
        depth: { type: Number, default: 0 },
        childCount: { type: Number, default: 0 },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

courseSchema.index({ parentId: 1, order: 1 });
// Same name is fine under different parents, never between siblings
courseSchema.index({ parentId: 1, titleKey: 1 }, { unique: true });

const Course: Model<ICourse> = mongoose.model<ICourse>('Course', courseSchema);
export default Course;