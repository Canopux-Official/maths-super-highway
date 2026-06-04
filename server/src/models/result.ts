import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResult extends Document {
  imageUrl: string;
  publicId: string;
  title?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const resultSchema = new Schema<IResult>(
  {
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    title: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Result: Model<IResult> = mongoose.model<IResult>('Result', resultSchema);
export default Result;
