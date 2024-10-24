import { type Document } from 'mongoose';
import { type Status } from '.';

export interface IUser extends Document {
  email: string;
  phonenumber: string;
  firstname: string;
  username: string;
  lastname: string;
  balance: number;
  profilePicture?: string;
  status: Status;
  isVerified: boolean;
  idAdmin: boolean;
  licenseVerificationInfo: string;
  isLicenseVerified: boolean;
  totalTripsJoined: number;
  totalTripsCreated: number;
}
