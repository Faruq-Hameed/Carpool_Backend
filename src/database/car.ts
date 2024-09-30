import { type ICar, Status } from '@/utils/types';
import mongoose, { Schema } from 'mongoose';

// Car Schema Definition
const CarSchema = new Schema<ICar>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, // Reference to the user
    model: {
      type: String,
      required: true,
    }, // Car model (e.g., Toyota Corolla)
    licensePlate: {
      type: String,
      required: true,
    }, // License plate number
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    verificationData: {
      // contains information about the car validation
    },
    seats: {
      type: Number,
      required: true,
    }, // Number of seats in the car
    status: {
      type: String,
      enum: Object.values(Status), // Use enum values
      default: Status.RESTRICTED, // Set default value to active
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ICar>('Car', CarSchema);
