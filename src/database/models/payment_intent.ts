import mongoose, { Schema, model, type Document, type Types } from 'mongoose';
import { PaymentStatus } from '@/utils/types';

interface IPayment<S extends string, N extends number> extends Document {
  amount: N;
  balance: N;
  account_name: S;
  bank: N;
  account_no: S;
  status: PaymentStatus;
  attended_by: Types.ObjectId;
  transaction: Types.ObjectId;
  user: Types.ObjectId;
}

const paymentSchema: Schema<IPayment<string, number>> = new Schema<
  IPayment<string, number>
>(
  {
    amount: {
      type: Number,
      min: 1,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      required: true,
    },
    account_name: { type: String, required: true },
    bank: { type: Number, required: true },
    account_no: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.pending,
    },
    attended_by: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
      default: null,
    },
    transaction: {
      type: mongoose.Schema.ObjectId,
      ref: 'transactions',
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
      required: true,
      // is this users or admin user
    },
  },
  { timestamps: true },
);

paymentSchema.index({ balance: 1, amount: 1, user: 1 }, { unique: true });

// export default model<IPayment<string, number>>('payments', paymentSchema);
const Payment = model<IPayment<string, number>>('payments', paymentSchema);
export { type IPayment, Payment };
