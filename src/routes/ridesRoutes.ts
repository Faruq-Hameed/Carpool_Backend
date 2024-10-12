import { Router } from 'express';
import {
  createRide,
  getAllRides,
  getRideById,
  updateRide,
  deleteRide,
  findRides,
} from '@/controllers/rideControllers';

const router = Router();

// Create a ride
router.post('/rides', createRide);

// Get all rides
router.get('/rides', getAllRides);

// Get rides within a route
router.get('/rides/search', findRides);

// Get a ride by ID
router.get('/rides/:rideId', getRideById);

// Update a ride by ID
router.put('/rides/:rideId', updateRide);

// Delete a ride by ID
router.delete('/rides/:rideId', deleteRide);

export default router;
