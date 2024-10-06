import mongoose, { Schema } from 'mongoose';
import { type ILocation, type IRide } from '@/utils/types';

// Location Schema for embedded locations (no _id)
const LocationSchema = new Schema<ILocation>(
  {
    name: { type: String, required: true },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere', // Geospatial index for querying nearby points
    },
  },
  { _id: false }, // no separate IDs for embedded docs
);

// Ride Schema Definition
const RideSchema = new Schema<IRide>(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, // Reference to the driver (user)
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    startingPoint: {
      type: LocationSchema, // coordinates of the starting point
      required: true,
    },
    destination: {
      // coordinates of the destination
      type: LocationSchema,
      required: true,
    },
    routes: {
      // coordinates of the routes including the starting point and the destination as index 0 and length-1
      type: [LocationSchema],
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },

    availableSeats: {
      type: Number,
      required: true,
    },
    pricePerSeat: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IRide>('Ride', RideSchema);
