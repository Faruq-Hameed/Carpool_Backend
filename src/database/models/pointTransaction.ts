import mongoose, { type Document, Schema } from 'mongoose';

interface IPointTransaction extends Document {
  user: mongoose.Schema.Types.ObjectId;
  action: number;
  earnings: string;
  ratedApp: boolean;
}

enum pointTransactionAction {
  refill = 'refill',
  referral = 'referral',
  trading = 'trading',
  order_review = 'order_review',
  app_rating = 'app_rating',
  point_conversion = 'point_conversion',
}

enum pointTransactionStatus {
  pending = 'pending',
  success = 'success',
  declined = 'declined',
}

enum pointTransactionType {
  credit = 'credit',
  debit = 'debit',
}

const pointTransactionSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: pointTransactionAction,
    },
    status: {
      type: String,
      required: true,
      default: pointTransactionStatus.pending,
      lowercase: true,
      enum: pointTransactionStatus,
    },
    type: {
      type: String,
      required: true,
      default: '',
      lowercase: true,
      enum: pointTransactionType,
    },
    amount: {
      type: Number,
      required: true,
    },
    balance_before: {
      type: Number,
      default: null,
    },
    balance_after: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true },
);

const PointTransaction = mongoose.model<IPointTransaction>(
  'PointTransaction',
  pointTransactionSchema,
);

export { type IPointTransaction, PointTransaction };
