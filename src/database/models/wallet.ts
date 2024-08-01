import { Schema, model, type Document } from 'mongoose';

export interface IWallet<N extends number> extends Document {
  balance: N;
  holding: N;
  tax: N;
  type: string;
}

const WalletSchema = new Schema<IWallet<number>>(
  {
    balance: {
      type: Number,
      min: 0,
      required: true,
    },
    holding: {
      type: Number,
      min: 0,
      required: true,
    },
    tax: {
      type: Number,
      min: 0,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default model<IWallet<number>>('wallets', WalletSchema);
