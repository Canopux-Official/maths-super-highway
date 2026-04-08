import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IEnrollment extends Document {
  student: Types.ObjectId;
  course: Types.ObjectId;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    student: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true
    },
    course: { 
      type: Schema.Types.ObjectId, 
      ref: 'Course', 
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

// Unique compound index
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment: Model<IEnrollment> = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);
export default Enrollment;