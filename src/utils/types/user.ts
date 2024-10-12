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
  idAdmin: boolean;
  status: Status;
}
