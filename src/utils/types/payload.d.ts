import type { ObjectId } from 'mongoose';
import type { AdminRole } from './model';

export interface UserPayload {
  _id: ObjectId;
  isAdmin: boolean;
  isDeleted: boolean;
  adminRole: AdminRole;
  sessionId: string;
}

export interface ManagerPayload {
  _id: ObjectId;
  is_active: boolean;
  job_title: string;
}
// ManagerPayload subeject to change

/* adding an optional user property to Request object**/
declare module 'express' {
  interface Request {
    user?: UserPayload | null;
    manager?: ManagerPayload | null;
  }
}
