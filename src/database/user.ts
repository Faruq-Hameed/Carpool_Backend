import { Status, type IUser } from '@/utils/types/';
import { CallbackError, Schema, model } from 'mongoose';
// import bcrypt from 'bcrypt';

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
      uppercase: true,
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

// Middleware to hash password before saving
userSchema.pre<IUser>(
  'save',
  async function (next: (err?: CallbackError) => void) {
    if (!this.isModified('password')) {
      next();
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
      next();
    } catch (error) {
      next(error as CallbackError);
    }
  },
);

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  userPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(userPassword, this.password as string);
};

export default model<IUser>('users', userSchema);
