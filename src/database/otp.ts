import mongoose, { type Document, Schema } from 'mongoose';

interface OtpDocument extends Document {
  channel: {
    phonenumber?: string;
    email?: string;
  };
  code: string;
  createdAt: Date;
}

const otpSchema = new Schema<OtpDocument>({
  channel: {
    phonenumber: { type: String, required: false },
    email: { type: String, required: false },
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // Document will be automatically deleted after 5 minutes
  },
});

const Otp = mongoose.model<OtpDocument>('Otp', otpSchema);

export default Otp;
