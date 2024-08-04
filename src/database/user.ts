import { type IUser, UserStatus } from '@/utils/types/user';
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
    enum: Object.values(UserStatus), // Use enum values
    default: UserStatus.NOT_VERIFIED, // Set default value if needed
  },
});

export default model<IUser>('users', userSchema);
