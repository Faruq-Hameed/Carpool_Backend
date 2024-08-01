import type mongoose from 'mongoose';

interface IUpdatePayment {
  paymentId: mongoose.Schema.Types.ObjectId;
  status: string;
  user: any;
}

export { type IUpdatePayment };
