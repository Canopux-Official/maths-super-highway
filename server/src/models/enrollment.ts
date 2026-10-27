import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IEnrollment extends Document {
  student: Types.ObjectId;
  course: Types.ObjectId;     // always a leaf when created
  needsReview: boolean;       // true when the leaf later gained children
  createdAt?: Date;
  updatedAt?: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    needsReview: { type: Boolean, default: false },
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment: Model<IEnrollment> = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);
export default Enrollment;