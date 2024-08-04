import { type Document } from 'mongoose';

export enum UserStatus {
  ACTIVE = 'active',
  NOT_VERIFIED = 'not_verified',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}
export interface IUser extends Document {
  email: string;
  phonenumber: string;
  firstname: string;
  lastname: string;
  balance: number;
  profilePicture?: string;
  idAdmin: boolean;
  status: UserStatus;
}
