import Car from '@/database/car';
import { BadRequestError, NotFoundError } from '@/utils/errors';
import { type ICar } from '@/utils/types';

class CarService {
  /**
   * Create a new car entry in the database.
   * @param carData - Data for creating a new car.
   * @returns The newly created car document.
   */
  public async createCar(carData: Partial<ICar>): Promise<ICar> {
    const doesLicenseExist = await Car.findOne({
      licensePlate: carData.licensePlate,
    });
    if (doesLicenseExist) {
      throw new BadRequestError(
        `License ${carData.licensePlate} already exists for another car`,
      );
    }
    const newCar = new Car(carData);
    return await newCar.save();
  }

  /**
   * Get all cars from the database.
   * @returns An array of car documents.
   */
  public async getAllCars(): Promise<ICar[]> {
    return await Car.find({})
      .populate('owner', 'firstname lastname email phone isVerified status')
      .exec();
  }

  /**
   * Get a car by its ID.
   * @param carId - The ID of the car.
   * @returns The car document if found, or null.
   */
  public async getCarById(carId: string): Promise<ICar> {
    const car = await Car.findById(carId).populate(
      'owner',
      'firstname lastname email phone isVerified status pictures',
    );
    if (!car) {
      throw new NotFoundError('car not found');
    }
    return car;
  }

  /**
   * Update a car by its ID.
   * @param carId - The ID of the car to update.
   * @param updateData - The fields to update.
   * @returns The updated car document if successful, or null.
   */
  public async updateCar(
    carId: string,
    updateData: Partial<ICar>,
  ): Promise<ICar | null> {
    const car = await Car.findById(carId).populate(
      'owner',
      'firstname lastname email phone isVerified status',
    );
    if (!car) {
      throw new NotFoundError('car not found');
    }
    // check if total pictures is already 4
    if (
      car.pictures.length >= 4 &&
      updateData.pictures &&
      updateData.pictures?.length > 0
    ) {
      throw new BadRequestError('You can only add 4 pictures');
    }
    return await Car.findByIdAndUpdate(carId, updateData, { new: true }).exec();
  }

  /**
   * Delete a car by its ID.
   * @param carId - The ID of the car to delete.
   * @returns The deleted car document if successful, or null.
   */
  public async deleteCar(carId: string): Promise<ICar | null> {
    const car = await this.getCarById(carId);
    if (!car) {
      throw new NotFoundError('car not found');
    }
    return await Car.findByIdAndUpdate(carId, {
      status: 'deleted',
    }).exec();
  }

  /**
   * Upload car pictures to S3 and update the car document.
   * @param carId - The ID of the car.
   * @param pictureUrls - Array of picture URLs uploaded to S3.
   * @returns The updated car document.
   */
  // public async uploadCarPictures(carId: string, pictureUrls: string[]): Promise<ICar | null> {
  //   const car = await this.getCarById(carId);
  //   car?.pictures.push(...pictureUrls);
  //   car?.save()
  //   return await Car.findByIdAndUpdate(
  //     carId,
  //     { pictures: pictureUrls },
  //     { new: true }
  //   ).exec();
  // }
  /**
   * Update the car verification data (Encrypted verification).
   * @param carId - The ID of the car.
   * @param verificationData - Encrypted car verification data.
   * @returns The updated car document or null.
   */
  // public async updateCarVerificationData(
  //   carId: string,
  //   verificationData: string
  // ): Promise<ICar | null> {
  //   return Car.findByIdAndUpdate(
  //     carId,
  //     { verificationData },
  //     { new: true }
  //   ).exec();
  // }
}

export default new CarService();
