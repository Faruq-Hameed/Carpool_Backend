import { type ICar, Status } from '@/utils/types';
import mongoose, { Schema } from 'mongoose';

// Car Schema Definition
const CarSchema = new Schema<ICar>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    }, // Reference to the user
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    licensePlate: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    pictures: {
      type: [String],
      validate: {
        validator: function (pictures: string[]) {
          return pictures.length <= 4; // Ensure not more than 4 pictures
        },
        message: 'Only 4 pictures are required.',
      },
      // required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    verificationData: {
      type: String,
      // contains information about the car validation
    },
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
