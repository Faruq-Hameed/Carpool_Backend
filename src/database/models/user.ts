import mongoose, { Schema, model, type Types, type Document } from 'mongoose';

import {
  type AccountDetails,
  type AdminRole,
  UserStatus,
  Channel,
} from '@/utils/types/';

export interface IUser extends Document {
  firstname?: string;
  lastname?: string;
  email: string;
  username: string;
  password: string;
  sessionId?: string;
  phone?: string;
  phone_temp?: string;
  balance?: number;
  acc_details?: Map<string, AccountDetails>;
  isAdmin?: boolean;
  adminRole?: AdminRole;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  reset_token?: string;
  email_verify_token: string;
  otp?: string;
  channel: Channel;
  referrer?: string;
  isDeleted: boolean;
  user_status: UserStatus;
  has_received_signup_bonus: Types.ObjectId;
  has_referrer_received_bonus?: Types.ObjectId;
  withdrawal_intent?: string;
}

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    firstname: {
      type: String,
      default: '',
    },
    lastname: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      private: true,
    },
    sessionId: {
      type: String,
      private: true,
      default: '',
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    phone_temp: {
      type: String,
    },
    balance: {
      type: Number,
      default: 0,
    },
    acc_details: {
      type: Map,
      of: {
        type: String,
        default: new Map<string, string>([
          ['bank', ''],
          ['number', ''],
          ['name', ''],
        ]),
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    adminRole: {
      type: String,
      enum: ['', 'superadmin', 'admin'],
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    reset_token: {
      type: String,
      default: '',
    },
    email_verify_token: {
      type: String,
      default: '',
    },
    otp: {
      type: String,
      default: '',
    },
    channel: {
      type: String,
      enum: Object.values(Channel), // allowing only values from Channel
      default: Channel.WEB,
    },
    referrer: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    user_status: {
      type: String,
      enum: Object.values(UserStatus), // allowing only values from UserStatus
      default: UserStatus.active,
      // blocked - no login, restricted - login but no withdrawal
      lowercase: true,
    },
    has_received_signup_bonus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'transactions',
      default: null,
    },
    has_referrer_received_bonus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'transactions',
      default: null,
    },
    withdrawal_intent: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);
const User = model<IUser>('users', userSchema);

export default User;
