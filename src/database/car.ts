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
    brand: {
      // e.g Lexus
      type: String,
      required: true,
    },
    model: {
      // e.g ES 350
      type: String,
      required: true,
    },
    year: {
      // e.g 2011
      type: String,
      required: true,
    },
    color: {
      // e.g blue
      type: String,
      required: true,
    },
    licensePlate: {
      type: String,
      required: true,
    },
    seats: {
      // total car seats: 5
      type: Number,
      required: true,
      default: 5,
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
    verificationData: {
      type: String,
      // contains information about the car validation
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
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
