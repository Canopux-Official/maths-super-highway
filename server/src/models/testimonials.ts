import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITestimonial extends Document {
  user: Types.ObjectId;
  course: Types.ObjectId;     // any node: programme, course or topic
  message: string;
  rating: number;             // 1..5
  showOnLanding: boolean;     // admin switch; reset to false when the student edits
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    message: { type: String, required: true, trim: true, minlength: 20, maxlength: 1000 },
    rating: { type: Number, min: 1, max: 5, required: true },
    showOnLanding: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// One review per student per topic
testimonialSchema.index({ user: 1, course: 1 }, { unique: true });

const Testimonial: Model<ITestimonial> = mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
export default Testimonial;