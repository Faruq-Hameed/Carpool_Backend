import { config } from '@/config/dev';
import { Manager, User } from '@/database/models';
import { NoTokenException, TokenException } from '@/exceptions';
import type { Request, Response, NextFunction } from 'express';
import jwt, { type Secret, type JwtPayload } from 'jsonwebtoken';
import { payload } from '@/utils/auth';
import { type UserPayload, type ManagerPayload } from '@/utils/types/payload';
import { logger } from '@/config/logger';

export const customerAuthenticator = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const bearerHeader = req.headers.authorization;
  if (!bearerHeader) {
    throw new NoTokenException();
  }
  const token = bearerHeader.split(' ')[1];
  if (!token) {
    throw new NoTokenException();
  }

  const decoded = jwt.verify(
    token,
    `${config.jwt.secret}` as Secret,
  ) as JwtPayload;
  const _id = decoded?._id;
  if (!decoded._id) {
    throw new TokenException();
  }

  const user = await User.findById(_id, payload);
  if (!user) {
    throw new TokenException();
  }
  req.user = user as UserPayload;
  next();
};

export const managerAuthenticator = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    next(new NoTokenException());
    return;
  }

  try {
    // Verify token and decode it
    const decoded = jwt.verify(
      token,
      config.jwt.secret as Secret,
    ) as JwtPayload;

    // Fetch the manager using the ID from the decoded token
    const manager = await Manager.findById(decoded._id);

    if (!manager) {
      next(new TokenException());
      return;
    }

    // Attach manager data to the request object
    req.manager = manager as ManagerPayload;
    next();
  } catch (error) {
    logger.error(error);
    // Handle errors from token verification or database query
    next(new TokenException());
  }
};
