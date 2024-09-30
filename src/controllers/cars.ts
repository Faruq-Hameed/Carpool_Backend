import { type Request, type Response } from 'express';
import CarService from '@/services/CarService';
import { type ICar } from '@/utils/types';

class CarController {
  /**
   * Controller method to create a new car.
   */
  public async createCar(req: Request, res: Response): Promise<void> {
    try {
      const carData = req.body;
      const newCar = await CarService.createCar(carData as Partial<ICar>);
      res.status(201).json(newCar);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create car' });
    }
  }

  /**
   * Controller method to get all cars.
   */
  public async getAllCars(req: Request, res: Response): Promise<void> {
    try {
      const cars = await CarService.getAllCars();
      res.status(200).json(cars);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve cars' });
    }
  }

  /**
   * Controller method to get a car by its ID.
   */
  public async getCarById(req: Request, res: Response): Promise<void> {
    try {
      const carId = req.params.id;
      const car = await CarService.getCarById(carId);
      if (car) {
        res.status(200).json(car);
      } else {
        res.status(404).json({ error: 'Car not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve car' });
    }
  }

  /**
   * Controller method to update a car by its ID.
   */
  public async updateCar(req: Request, res: Response): Promise<void> {
    try {
      const carId = req.params.id;
      const updateData = req.body;
      const updatedCar = await CarService.updateCar(
        carId,
        updateData as Partial<ICar>,
      );
      if (updatedCar) {
        res.status(200).json(updatedCar);
      } else {
        res.status(404).json({ error: 'Car not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update car' });
    }
  }

  /**
   * Controller method to delete a car by its ID.
   */
  public async deleteCar(req: Request, res: Response): Promise<void> {
    try {
      const carId = req.params.id;
      const deletedCar = await CarService.deleteCar(carId);
      if (deletedCar) {
        res.status(200).json(deletedCar);
      } else {
        res.status(404).json({ error: 'Car not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete car' });
    }
  }

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
  //       res.status(500).json({ error: 'Failed to update car verification data' });
  //     }
  //   }
}

export default new CarController();
