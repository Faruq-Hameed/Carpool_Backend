import mongoose, { Schema, type Document, type Types } from 'mongoose';

interface ICustomerNote extends Document {
  note: string;
  customerId: Types.ObjectId;
  managerId: Types.ObjectId;
}

// customer note schema
const customerSchema = new Schema<ICustomerNote>(
  {
    note: {
      type: String,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'managers',
    },
  },
  { timestamps: true },
);

const CustomerNote = mongoose.model<ICustomerNote>(
  'Customer_Notes',
  customerSchema,
);

export { CustomerNote, type ICustomerNote };
