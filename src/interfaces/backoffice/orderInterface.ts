import type mongoose from 'mongoose';

enum orderStatus {
  pending = 'pending',
  success = 'success',
  declined = 'declined',
}

interface IUpdateOrder {
  orderId: mongoose.Schema.Types.ObjectId;
  status: orderStatus;
  description: string;
  images: any;
  manager: any;
}

interface IcreditOrder {
  orderId: mongoose.Schema.Types.ObjectId;
  user: any;
}

export type { IUpdateOrder, IcreditOrder };
