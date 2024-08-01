import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { IUser } from '@/database/models/user';
import { config } from '@/config/dev';
import type { IManager } from '@/database/models';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRound = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, saltRound);
};

export const comparePassword = async (
  password: string,
  dbPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(dbPassword, password);
};

export const payload: string = '_id isAdmin isDeleted adminRole sessionId';
export const adminPayload: string = '_id is_active job_title'; // subject to change

export const userPublicFields =
  'email username phone firstname lastname _id isverified reset_token';

export const generateAuthToken = (user: IUser): string => {
  return jwt.sign(
    {
      _id: user._id,
      isAdmin: user.isAdmin,
      isDeleted: user.isDeleted,
      adminRole: user.adminRole,
      sessionId: user.sessionId,
    },
    `${config.jwt.secret}` ?? '',
    { expiresIn: config.jwt.expiresIn },
  );
};

export const generateManagerToken = (manager: IManager): string => {
  return jwt.sign(
    {
      _id: manager._id,
      username: manager.username,
      // page_permission: manager.page_permission,
      firstname: manager.firstname,
    },
    `${config.jwt.secret}` ?? '',
    { expiresIn: config.jwt.expiresIn },
  );
};

export const validateToken = (token: string): unknown => {
  return jwt.verify(token, `${config.jwt.secret}` ?? '');
};
