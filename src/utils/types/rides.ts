import { type ObjectId } from 'mongoose';
import { type Status } from './general';

/** Car interface
 * @ owner: Reference to the user who owns the car
 * @ maker: Car maker (e.g., Toyota)
 * @ model: Car model (e.g., Toyota Corolla)
 * @ year: Car year (e.g., 2006)
 * @ color: Car model (e.g., blue)
 * @ licensePlate: License plate number
 * @ seats: Number of seats in the car
 */
export interface ICar {
  owner: ObjectId;
  brand: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  pictures: string[]; // Array of URLs/paths to car pictures
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
export interface IRide {
  driverId: ObjectId;
  startingPoint: ILocation;
  destination: ILocation;
  routes: ILocation[]; // Array of locations forming the planned route
  carId: ObjectId; // Reference to Car model
  departureTime: Date;
  availableSeats: number;
  pricePerSeat: number;
}
