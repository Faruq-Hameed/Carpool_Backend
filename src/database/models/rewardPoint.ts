import mongoose, { type Document, Schema } from 'mongoose';

interface IRewardPoint extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  balance: number;
  earnings: EarningType;
  ratedApp: boolean;
}

enum EarningType {
  refill = 'refill',
  referral = 'referral',
  trading = 'trading',
  order_review = 'order_review',
  app_rating = 'app_rating',
}

const rewardPointSchema: Schema<IRewardPoint> = new Schema<IRewardPoint>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
    required: true,
  },
  earnings: {
    type: String,
  },
  ratedApp: {
    // to track one time app rating
    type: Boolean,
    default: false,
  },
});

const RewardPoint = mongoose.model<IRewardPoint>(
  'RewardPoint',
  rewardPointSchema,
);

export { type IRewardPoint, RewardPoint };
