import mongoose, { Schema, type Document } from 'mongoose';

interface ITransaction extends Document {
  user: mongoose.Schema.Types.ObjectId;
  action_model: string;
  action_id: mongoose.Schema.Types.ObjectId;
  name: string;
  status: string;
  type: string;
  parent_category: string;
  images: string[];
  amount: number;
  description: string;
  balance_before: number;
  balance_after: number;
  email_notification: boolean;
}

enum actionModel {
  orders = 'orders',
  point_transactions = 'point_transactions',
  payments = 'payments',
}

enum transactionStatus {
  pending = 'pending',
  success = 'success',
  declined = 'declined',
}

enum transactionType {
  order = 'order',
  debit = 'debit',
  credit = 'credit',
  undefined = '',
}

enum parentCategory {
  ReferralBonus = 'referral_bonus', // credit
  PointConversion = 'point_conversion',
  SignupBonus = 'signup_bonus', // credit
  TransferCredit = 'transfer_credit', // credit P2P
  TransferDebit = 'transfer_debit', // debit P2P
  OutboundWithdraw = 'outbound_withdraw', // MANUAL TRANSFER - debit
  OutboundWithdrawAuto = 'outbound_withdraw_auto', // AUTO TRANSFER - debit
  WithdrawRefund = 'withdraw_refund', // AUTO TRANSFER REFUND - credit
  Undefined = '', // empty string to handle undefined or unknown transaction types
}

const transactionSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    action_model: {
      type: String,
      enum: actionModel,
      required: true,
      default: 'orders',
    },
    action_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'action_model',
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: transactionStatus.pending,
      lowercase: true,
      enum: transactionStatus,
    },
    type: {
      type: String,
      required: true,
      default: transactionType.undefined,
      lowercase: true,
      enum: transactionType,
    },
    parent_category: {
      type: String,
      default: parentCategory.Undefined,
      lowercase: true,
      enum: parentCategory,
    },
    images: {
      type: Array,
      default: '',
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
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
    email_notification: {
      type: Boolean,
      default: null,
    },
  },
  { timestamps: true },
);

const Transaction = mongoose.model<ITransaction>(
  'transactions',
  transactionSchema,
);

export { type ITransaction, Transaction };
