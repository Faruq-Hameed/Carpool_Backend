import Ride from '@/database/rides';
import { NotFoundError } from '@/utils/errors';
import { type IRide } from '@/utils/types';

class RideService {
  // Create a new ride
  public async createRide(rideData: Partial<IRide>): Promise<IRide> {
    const newRide = new Ride(rideData);
    return await newRide.save();
  }

  // Get all rides or search by query
  public async getAllRides(): Promise<IRide[]> {
    return await Ride.find().populate('driverId carId'); // Populates driver and car references
  }

  // Get ride by ID
  public async getRideById(rideId: string): Promise<IRide | null> {
    const ride = await Ride.findById(rideId).populate('driverId carId');
    if (!ride) {
      throw new NotFoundError('Ride not found');
    }
    return ride;
  }

  // Update ride by ID
  public async updateRide(
    rideId: string,
    updateData: Partial<IRide>,
  ): Promise<IRide | null> {
    const ride = await Ride.findByIdAndUpdate(rideId, updateData, {
      new: true,
    }).populate('driverId carId');
    if (!ride) {
      throw new NotFoundError('Ride not found');
    }
    return ride;
  }

  // Delete ride by ID
  public async deleteRide(rideId: string): Promise<void> {
    const ride = await Ride.findByIdAndDelete(rideId);
    if (!ride) {
      throw new NotFoundError('Ride not found');
    }
  }
}

export default new RideService();
