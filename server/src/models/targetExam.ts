import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITargetExam extends Document {
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const targetExamSchema = new Schema<ITargetExam>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const TargetExam: Model<ITargetExam> = mongoose.model<ITargetExam>('TargetExam', targetExamSchema);
export default TargetExam;
