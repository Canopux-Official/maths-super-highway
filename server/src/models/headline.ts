import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHeadline extends Document {
  text: string;
  link?: string;
  isLive: boolean;
  /** Optional: hide automatically after this moment. null = no expiry. */
  liveUntil?: Date | null;
}

const headlineSchema = new Schema<IHeadline>(
  {
    text: { type: String, required: true },
    link: { type: String },
    isLive: { type: Boolean, default: true },
    liveUntil: { type: Date, default: null }
  },
  { timestamps: true }
);

const Headline: Model<IHeadline> = mongoose.model<IHeadline>('Headline', headlineSchema);
export default Headline;