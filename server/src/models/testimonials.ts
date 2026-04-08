import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITestimonial extends Document {
  user: Types.ObjectId;
  course: Types.ObjectId;
  message: string;
  rating: number;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true }
  },
  { timestamps: true }
);

const Testimonial: Model<ITestimonial> = mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
export default Testimonial;