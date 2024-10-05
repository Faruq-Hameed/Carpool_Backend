import { Router } from 'express';
import CarController from '@/controllers/carsController';
import { upload } from '@/utils/awsConfig';
import multer from 'multer';

const { createCar, getCarById, getAllCars, updateCar } = CarController;

const carRouter = Router();

carRouter.post('/', createCar);
carRouter.get('/', getAllCars);
carRouter.get('/:id', getCarById);

// Update car routes, pictures can be added here
carRouter.put(
  '/:id',
  (req, res, next) => {
    // NEEDED TO CHECK IF 4 EXISTING PICTURES ARE < 4
    upload.array('car_pictures', 4)(req, res, function (err): any {
      if (err instanceof multer.MulterError) {
        // A Multer-specific error occurred
        return res.status(400).json({ message: err.message });
      } else if (err) {
        // A general error occurred
        next(err); return; // This sends the error to the next middleware (Express error handler)
      }
      next(); // Proceed to the car update controller if file upload was successful
    });
  },
  updateCar,
);

export default carRouter;
