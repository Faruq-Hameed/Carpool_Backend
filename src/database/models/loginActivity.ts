import mongoose, { Schema, type Document, type Types } from 'mongoose';

// Interface representing a document in MongoDB
interface ILoginActivity extends Document {
  manager_id: Types.ObjectId;
  ipAddress: string;
}

// Mongoose schema for login activity
const LoginActivitySchema = new Schema(
  {
    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'managers',
      required: true,
    },
    ipAddress: { type: String, required: true },
  },
  { timestamps: true },
);

// Export Mongoose model
const LoginActivity = mongoose.model<ILoginActivity>(
  'login_activity',
  LoginActivitySchema,
);

export { LoginActivity, type ILoginActivity };
