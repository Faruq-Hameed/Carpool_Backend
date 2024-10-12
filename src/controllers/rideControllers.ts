import { type NextFunction, type Request, type Response } from 'express';
import RideService from '../services/RideService';
import { validateRideSearch } from '@/utils/joiSchema/carSchema';
import { type ILocation, type IRide } from '@/utils/types';
import { BadRequestError } from '@/utils/errors';
// import RideService from '@//services/RideService'

// Create a ride
export const createRide = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const rideData = req.body;
    const newRide = await RideService.createRide(rideData as Partial<IRide>);
    res.status(201).json(newRide);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ride' });
  }
};

// Get all rides
export const getAllRides = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const rides = await RideService.getAllRides();
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get rides' });
  }
};

// Get ride by ID
export const getRideById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { rideId } = req.params;
    const ride = await RideService.getRideById(rideId);
    res.status(200).json(ride);
  } catch (error) {
    res.status(404).json({ error: 'Ride not found' });
  }
};

// Find rides based on geolocation (starting point, destination, and radius)
export const findRides = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { value, error } = validateRideSearch(req.query);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }
    const { startLat, startLng, destLat, destLng, radius } = value;
    // Convert query params to numbers and handle validation
    const startLocation: ILocation = {
      name: 'Start Location',
      coordinates: [startLng as number, startLat as number],
    };

    const destinationLocation: ILocation = {
      name: 'Destination Location',
      coordinates: [destLng as number, destLat as number],
    };

    const { message, data } = await RideService.findRidesWithinRadius(
      startLocation,
      destinationLocation,
      radius as number,
    );
    res.status(200).json({
      data,
      message,
    });
  } catch (error) {
    next(error);
  }
};

// Update a ride by ID
export const updateRide = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { rideId } = req.params;
    const updateData = req.body;
    const updatedRide = await RideService.updateRide(
      rideId,
      updateData as Partial<IRide>,
    );
    res.status(200).json(updatedRide);
  } catch (error) {
    res.status(404).json({ error: 'Ride not found or update failed' });
  }
};

// Delete a ride by ID
export const deleteRide = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { rideId } = req.params;
    await RideService.deleteRide(rideId);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Ride not found or delete failed' });
  }
};
