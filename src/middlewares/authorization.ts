import type { Request, Response, NextFunction } from 'express';

// additional authorization middleware
// checks for account validity, and others
export const customerAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  next();
};

// checks for permission requirements on certain endpoints
export const managerAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  next();
};
