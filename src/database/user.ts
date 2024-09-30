import { Status, type IUser } from '@/utils/types/';
import { Schema, model } from 'mongoose';

const userSchema = new Schema<IUser>({
  phonenumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  balance: {
    type: Number,
    default: 0,
  },
  idAdmin: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: Object.values(Status), // Use enum values
    default: Status.RESTRICTED, // Set default value to active
  },
});

export default model<IUser>('users', userSchema);
