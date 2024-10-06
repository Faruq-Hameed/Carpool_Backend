import { type NextFunction, Router } from 'express';
import CarController from '@/controllers/carsController';
import { upload } from '@/utils/awsConfig';
import { uploadErrorHandler } from '@/middlewares/uploadErrorMiddlewares';

const { createCar, getCarById, getAllCars, updateCar, deleteCar } =
  CarController;

const carRouter = Router();

carRouter.post('/', createCar);
carRouter.get('/', getAllCars);
carRouter.get('/:id', getCarById);
carRouter.get('/:id', deleteCar);

// carRouter.put(
//   '/:id',
//   // File upload middleware (for up to 4 pictures)
//   upload.array('car_pictures', 4),

//   // Custom upload error handler
//   ( err: unknown, // Specify `unknown` for the error type to avoid using `any`
//     req: Request,
//     res: Response,
//     next: NextFunction,) => {
//     if (err) {
//       return uploadErrorHandler(err, req, res, next); // Only handle upload-related errors here
//     }
//     next();
//   },

//   // Main car update controller method
//   updateCar,
// );

// Define your route
carRouter.put(
  '/:id',
  // File upload middleware (for up to 4 pictures)
  upload.array('car_pictures', 4),

  // Custom upload error handler
  (err, req, res, next) => {
    if (err) {
      return uploadErrorHandler(
        err,
        req as Request,
        res as Response,
        next as NextFunction,
      ); // Only handle upload-related errors here
    }
    next();
  },

  // Main car update controller method
  updateCar,
);

export default carRouter;
