import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHeadline extends Document {
  text: string;
  link?: string;
  isLive: boolean;
}

const headlineSchema = new Schema<IHeadline>(
  {
    text: { type: String, required: true },
    link: { type: String },
    isLive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Headline: Model<IHeadline> = mongoose.model<IHeadline>('Headline', headlineSchema);
export default Headline;