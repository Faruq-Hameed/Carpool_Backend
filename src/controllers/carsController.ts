import { type NextFunction, type Request, type Response } from 'express';
import CarService from '@/services/CarService';
import { type ICar } from '@/utils/types';
import { createCarValidator } from '@/utils/joiSchema/carSchema';
import { BadRequestError } from '@/utils/errors';
import { type MulterS3File } from '@/utils/types/general';

class CarController {
  /**
   * Controller method to create a new car.
   */
  public createCar = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { value, error } = createCarValidator(req.body as Partial<ICar>);
      if (error) {
        throw new BadRequestError(error.details[0].message);
      }
      res.status(200).send({
        message: 'new car added successfully',
        car: await CarService.createCar(value as Partial<ICar>),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller method to get all cars.
   */
  public getAllCars = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const cars = await CarService.getAllCars();
      res.status(200).send({ message: 'cars available', cars });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller method to get a car by its ID.
   */
  public getCarById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      res.status(200).send({
        message: 'car available',
        car: await CarService.getCarById(req.params.id),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller method to update a car by its ID.
   */
  public updateCar = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const carId = req.params.id;
      const updateData = req.body;

      // Check if files were uploaded and attach URLs to the updateData
      if (req.files) {
        const pictures = req.files as MulterS3File[];
        const uploadedUrls = pictures.map(picture => picture.location); // Collect the S3 URLs

        if (uploadedUrls.length > 0) {
          updateData.pictures = uploadedUrls; // Add URLs to updateData
        }
      }

      const updatedCar = await CarService.updateCar(
        carId,
        updateData as Partial<ICar>,
      );
      res
        .status(200)
        .send({ message: 'car updated successfully', car: updatedCar });
    } catch (error) {
      next(error);
    }
  };

  // // Method to upload pictures for a specific car
  // public uploadCarPictures = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void> => {
  //   const carId = req.params.carId;

  //   try {
  //     // Find the car by ID
  //     const car = await CarService.getCarById(carId);

  //     // Upload pictures using multer-S3
  //     upload.array('car_pictures', 4)(req, res, async (err: any) => {
  //       if (err) {
  //         return res.status(500).json({ error: 'Failed to upload pictures' });
  //       }

  //       // Collect uploaded picture URLs
  //       const pictures = req.files as MulterS3File[];
  //       const uploadedUrls = pictures.map(picture => picture.location);

  //       // Update the car with the uploaded picture URLs
  //       car.pictures = uploadedUrls;

  //       res
  //         .status(200)
  //         .json({
  //           message: 'Pictures uploaded successfully',
  //           pictures: uploadedUrls,
  //         });
  //     });
  //   } catch (error) {
  //     res.status(500).json({ error: 'Failed to upload car pictures' });
  //   }
  // };

  /**
   * Controller method to delete a car by its ID.
   */
  public deleteCar = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const carId = req.params.id;
      await CarService.deleteCar(carId);
      res.status(200).json({ message: 'car deleted successfully', car: null });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller method to update the car's verification data.
   */
  //   public async updateCarVerificationData(req: Request, res: Response): Promise<void> {
  //     try {
  //       const carId = req.params.id;
  //       const { verificationData } = req.body;
  //       const updatedCar = await CarService.updateCarVerificationData((carId), verificationData);
  //       if (updatedCar) {
  //         res.status(200).json(updatedCar);
  //       } else {
  //         res.status(404).json({ error: 'Car not found' });
  //       }
  //     } catch (error) {
  // next(error)
  //     }
  //   }
}

export default new CarController();
