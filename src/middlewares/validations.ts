import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

export function isValidObjectId(
  req: Request,
  res: Response,
  next: NextFunction,
): any {
  if (req.params.id && !Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: 'Invalid object identifier',
      data: null,
    });
  }

  next();
}
