import { Status, type IUser } from '@/utils/types/';
import { Schema, model } from 'mongoose';

const userSchema = new Schema<IUser>(
  {
    phonenumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: {
      type: String,
    },
    balance: {
      type: Number,
      default: 0,
    },
    licenseVerificationInfo: {
      // LNo will there first, then updated with verification result
      type: String,
      default: '',
    },
    isLicenseVerified: {
      // only verified users can create ride
      type: Boolean,
      default: false,
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
    isVerified: {
      type: Boolean,
      default: false,
    },
    totalTripsJoined: {
      // trip joined
      type: Number,
      default: 0,
    },
    totalTripsCreated: {
      // trip created wether people joined or not
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default model<IUser>('User', userSchema);
