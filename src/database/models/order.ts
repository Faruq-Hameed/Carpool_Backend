import mongoose, { Schema, type Document } from 'mongoose';

interface IOrder extends Document {
  product_id: mongoose.Types.ObjectId;
  product_name: string;
  items: string[];
  user: mongoose.Types.ObjectId;
  type: orderType;
  category?: orderCategory;
  images?: string[];
  ecode?: string;
  return_in_ngn: number;
  return_in_usd?: number;
  status: orderStatus;
  fund_disbursed: boolean;
  attended_by?: mongoose.Types.ObjectId;
  fund_disbursed_by?: mongoose.Types.ObjectId;
  mark_as_seen: boolean;
  rating?: number;
  comment: string;
  has_received_trading_point: boolean;
}

export enum orderStatus {
  pending = 'pending',
  success = 'success',
  declined = 'declined',
}

enum orderType {
  card = 'card',
  coin = 'coin',
}

enum orderCategory {
  physical = 'physical',
  ecode = 'ecode',
}

const orderSchema: Schema = new Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'products',
    },
    product_name: {
      type: String,
      required: true,
    },
    items: {
      type: [String],
      required: true,
      validate: {
        validator: function (v: string | any[]) {
          return v && v.length > 0;
        },
        message: 'At least one item should be exchanged!',
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    type: {
      type: String,
      required: true,
      enum: orderType,
      lowercase: true,
    },
    category: {
      type: String,
      enum: orderCategory,
      required: function (this: IOrder) {
        return this.type === 'card';
      },
      lowercase: true,
    },
    images: {
      type: [String],
      required: function (this: IOrder) {
        return this.category !== 'ecode';
      },
    },
    ecode: {
      type: String,
      required: function (this: IOrder) {
        return this.category === 'ecode';
      },
    },
    return_in_ngn: {
      type: Number,
      required: true,
    },
    return_in_usd: {
      type: Number,
    },
    status: {
      type: String,
      default: orderStatus.pending,
      lowercase: true,
      enum: orderStatus,
    },
    fund_disbursed: {
      type: Boolean,
      default: false,
      lowercase: true,
    },
    attended_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      default: null,
    },
    fund_disbursed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      default: null,
    },
    mark_as_seen: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
      validate: function (value: number | null) {
        return value === null || (value >= 1 && value <= 5);
      },
      message: (props: { value: any }) =>
        `${props.value} not allowed. rating must be between 1 to 5 `,
    },
    comment: {
      type: String,
      default: '',
    },
    has_received_trading_point: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model<IOrder>('orders', orderSchema);

export { type IOrder, Order };
