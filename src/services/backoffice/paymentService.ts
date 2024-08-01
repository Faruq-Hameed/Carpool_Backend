import { logger } from '@/config/logger';
import { Payment, Transaction } from '@/database/models';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  ServerException,
} from '@/exceptions';
import { type IUpdatePayment } from '@/interfaces/backoffice/paymentInterface';
import { paginate, type SortOption } from '@/utils/common';
import mongoose, { type ClientSession } from 'mongoose';

class PaymentService {
  async getPayments(query: Record<string, any>): Promise<any> {
    const managerBasic = 'email firstname lastname username';
    const {
      page = 1,
      limit = 10,
      paymentId,
      userId,
      managerId,
      accountName,
      transactionId,
      status,
      startDate,
      endDate,
    } = query;
    const sort: SortOption = { createdAt: -1 };
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort,
      populate: [
        { path: 'users' },
        { path: 'user', select: managerBasic },
        // { path: "managers" }, // attach managers to the order (v2 Implementation)
        { path: 'attended_by', select: managerBasic },
      ],
    };
    const DBquery: Record<string, any> = {
      ...(status && { status }),
      ...(userId && { user: userId }),
      ...(paymentId && { _id: paymentId }),
      ...(managerId && { attended_by: managerId }),
      ...(accountName && { account_name: accountName }),
      ...(transactionId && { transaction: transactionId }),
      ...(startDate && {
        createdAt: { $gte: new Date(startDate as unknown as Date) },
      }),
      ...(endDate && {
        createdAt: { $lte: new Date(endDate as unknown as Date) },
      }),
    };
    return await paginate(Payment, DBquery, options);
  }

  async getPaymentById(id: string): Promise<any> {
    const payment = await Payment.findById(id)
      .populate({ path: 'user', select: 'name email', strictPopulate: false })
      // .populate('managers') // till migration is complete
      .populate({
        path: 'attended_by',
        select: 'name email',
        strictPopulate: false,
      })
      .populate({
        path: 'transaction',
        select: 'amount status type',
        strictPopulate: false,
      })
      .exec();
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async updatePaymentRequest(data: IUpdatePayment): Promise<any> {
    // start the session and employ the try catch to handle errors
    const session: ClientSession = await mongoose.startSession();

    try {
      session.startTransaction();
      // get transaction and payment
      const [transaction, payment] = await Promise.all([
        Transaction.findOne({ action_id: data.paymentId }).session(session),
        Payment.findById(data.paymentId).session(session),
      ]);

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      if (!payment) {
        throw new NotFoundException('Withdrawal request not found');
      }

      // Ensure that the payment status is pending before proceeding
      if (payment.status !== 'pending') {
        throw new ConflictException('Payment has already been attended to');
      }
      // Ensure that the transaction status is pending before proceeding
      const paymentPayload = {
        status: data.status,
        attended_by: data.user._id,
        payment_type: 'request_withdraw',
        transfer_status: 'pending',
      };
      // get the description for any transaction status
      const descriptions = {
        success: `You successfully made a fund withdrawal of ₦${payment.amount} to your bank account ${payment.account_no}.`,
        declined: `Your withdrawal request of ₦${payment.amount} to the bank account ${payment.account_no} failed and your wallet has been refunded, contact our support for more information.`,
      };
      // create a transaction payload
      const transactionPayload = {
        status: data.status,
        description: descriptions[data.status],
      };

      // perform the update on the payment
      const paymentUpdate = await Payment.findOneAndUpdate(
        { _id: data.paymentId, status: 'pending' },
        paymentPayload,
        { new: true },
      ).session(session);

      if (!paymentUpdate) {
        throw new ConflictException('Payment has already been attended to');
      }

      // update the transaction
      const transactionUpdate = await Transaction.findOneAndUpdate(
        { action_id: data.paymentId },
        transactionPayload,
        { new: true },
      ).session(session);

      if (!transactionUpdate) {
        throw new BadRequestException('Transaction is invalid');
      }
      // check if the status is success and perform the automatic transfer
      if (data.status === 'success') {
        // automatic fund transfer
        // await handleTransfer(paymentUpdate);
      }
      // commit the transaction (save the changes)
      await session.commitTransaction();
      return { paymentUpdate, transactionPayload };
    } catch (error) {
      logger.error(error);
      // abort the transaction
      await session.abortTransaction();
      throw new ServerException(
        'An error occurred while processing your request',
      );
    } finally {
      await session.endSession();
    }
  }
}

export default new PaymentService();
