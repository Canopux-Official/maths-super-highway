import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOtp extends Document {
  email: string;
  otp: string;
  attempts: number;
  userId: mongoose.Types.ObjectId;
  onModel: 'student' | 'admin' | 'User';
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  userId: { type: Schema.Types.ObjectId, required: true, refPath: 'onModel' },
  onModel: { type: String, required: true, enum: ['student', 'admin', 'User'] },
  createdAt: { type: Date, default: Date.now, expires: 300 } // Expires in 5 minutes (300 seconds)
});

const Otp: Model<IOtp> = mongoose.model<IOtp>('Otp', otpSchema);
export default Otp;
