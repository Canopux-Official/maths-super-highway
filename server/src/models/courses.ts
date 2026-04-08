import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  content: string; 
  parentId: Types.ObjectId | null;
  // Generic labels: folder (can hold items), page (has the Tiptap content)
  itemType: 'folder' | 'page'; 
  order: number;
  isActive: boolean;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    parentId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Course', 
      default: null 
    },
    itemType: {
      type: String,
      enum: ['folder', 'page'],
      default: 'folder'
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

courseSchema.virtual('children', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'parentId'
});

const Course: Model<ICourse> = mongoose.model<ICourse>('Course', courseSchema);
export default Course;