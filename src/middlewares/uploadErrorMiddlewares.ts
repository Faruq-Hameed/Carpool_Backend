// import { BadRequestError } from "@/utils/errors";
// import { NextFunction } from "express";
// import multer from "multer";

import { BadRequestError } from '@/utils/errors';
import { type NextFunction } from 'express';
import multer from 'multer';

// // Middleware to handle upload errors
// export const uploadErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) =>{
//     if (err instanceof multer.MulterError) {
//       // Handle Multer-specific errors
//       if (err.code === 'LIMIT_FILE_SIZE') {
//         return next(new BadRequestError('File size should not exceed 5MB'));
//       } else if (err.code === 'LIMIT_FILE_COUNT') {
//         return next(new BadRequestError('You can upload up to 4 files only'));
//       }
//       return next(new BadRequestError(`Upload error: ${err.message}`));
//     } else if (err) {
//       // Handle other errors
//     //   return next(new BadRequestError('An error occurred during file upload'));
//     return next(err);

//     }
//     next();
//   }

// Middleware to handle upload errors
export function uploadErrorHandler(
  err: any,
  req: Request, // Ensure you're using the Express Request type
  res: Response,
  next: NextFunction,
): any {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      next(new BadRequestError('File size should not exceed 5MB')); return;
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      next(new BadRequestError('You can upload up to 4 files only')); return;
    }
    next(new BadRequestError(`Upload error: ${err.message}`)); return;
  } else if (err) {
    // Handle other errors
    next(new BadRequestError('An error occurred during file upload')); return;
  }
  next();
}
