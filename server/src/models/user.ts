import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone: string;
  dob?: Date;
  role: 'admin' | 'student' | 'parent' | 'college';
  isActive: boolean;
  isVerified: boolean;
  targetExams?: mongoose.Types.ObjectId[];
  feedbackCount?: number; // how many testimonial slots this student has used (max 5)
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true },
    dob: { type: Date },
    role: {
      type: String,
      enum: ['admin', 'student', 'parent', 'college'],
      default: 'student'
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    targetExams: [{ type: Schema.Types.ObjectId, ref: 'TargetExam' }],
    feedbackCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;