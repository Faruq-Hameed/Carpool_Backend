import { type Document, type ObjectId } from 'mongoose';
import { type Status } from '.';

/** Car interface
 * @ owner: Reference to the user who owns the car
 * @ model: Car model (e.g., Toyota Corolla)
 * @ licensePlate: License plate number
 * @ seats: Number of seats in the car
 */
export interface ICar extends Document {
  owner: ObjectId;
  model: string;
  licensePlate: string;
  seats: number;
  isVerified: boolean;
  status: Status;
  verificationData: string; //  for verification data;
}

/** Location interface
 * @ name: string
 * @ coordinates: [longitude: number, latitude: number]
 */
export interface ILocation {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
}

/** Ride interface
 * @ driverId: Reference to the user (driver)
 * @ startingPoint: The ride's starting location
 * @ destination: The ride's destination location
 * @ routes: Full array of route locations (including start and end)
 * @ carId: Reference to the car used for the ride
 * @ departureTime: Time of departure for the ride
 * @ availableSeats: Number of seats available for passengers
 * @ pricePerSeat: Cost per seat for the ride
 */
export interface IRide extends Document {
  driverId: ObjectId;
  startingPoint: Location;
  destination: Location;
  routes: Location[]; // Array of locations forming the planned route
  carId: ObjectId; // Reference to Car model
  departureTime: Date;
  availableSeats: number;
  pricePerSeat: number;
  departureRange: number; // in munutes +/- waiting time e.g 10
}
