import { logger } from '@/config/logger';
import { PointTransaction, RewardPoint } from '@/database/models';
import { BadRequestException } from '@/exceptions';

const pointValue: number = 50;
const minimumPointWithdrawal: number = 20;

const pointsPerTask = {
  refill: 1,
  app_rating: 1,
  trading: 5,
  order_review: 2,
  referral: 5,
};

/** function that awards points based on the task performed   */
const awardPointForTask = async (
  userId: any,
  task: string,
): Promise<boolean> => {
  try {
    // award point for the user
    let userPointObj = await RewardPoint.findOne({ userId });
    //   if user has not get any point before the point object has to be created
    if (!userPointObj) {
      userPointObj = await RewardPoint.create({ userId });
    }

    const initialPointBalance = userPointObj.balance;
    userPointObj.balance += pointsPerTask[task];
    await userPointObj.save();

    // create point transaction
    await PointTransaction.create({
      user: userId,
      action: task,
      type: 'credit',
      status: 'success',
      amount: pointsPerTask[task],
      balance_before: initialPointBalance,
      balance_after: userPointObj.balance,
    });

    return true;
  } catch (err) {
    logger.error(err);
    throw new BadRequestException('Error awarding point');
  }
};

export { awardPointForTask, pointValue, minimumPointWithdrawal };
