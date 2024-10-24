import Ride from '@/database/rides';
import { BadRequestError, NotFoundError } from '@/utils/errors';
import { type ILocation, type IRide } from '@/utils/types';

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

  // Find rides passing through a certain starting point and destination with a radius
  public async findRidesWithinRadius(
    startLocation: ILocation,
    destinationLocation: ILocation,
    radiusInMiles: number,
  ): Promise<any> {
    const milesToMeters = (miles: number): number => miles * 1609.34; // Convert miles to meters

    const radiusInMeters = milesToMeters(radiusInMiles);

    const rides = await Ride.find({
      $and: [
        {
          'startingPoint.coordinates': {
            $geoWithin: {
              $centerSphere: [
                [startLocation.coordinates[0], startLocation.coordinates[1]],
                radiusInMeters / 6378.1,
              ], // Radius in radians
            },
          },
        },
        {
          'routes.coordinates': {
            $geoWithin: {
              $centerSphere: [
                [
                  destinationLocation.coordinates[0],
                  destinationLocation.coordinates[1],
                ],
                radiusInMeters / 6378.1,
              ], // Radius in radians
            },
          },
        },
      ],
    }).populate('driverId carId'); // Populating the driver and car references

    if (!rides.length) {
      throw new BadRequestError('No rides found within the specified radius.');
    }

    return {
      data: rides,
      message: 'Rides available',
    };
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
