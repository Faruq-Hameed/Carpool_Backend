import { paginate, type SortOption } from '@/utils/common';
import { BadRequestException, NotFoundException } from '@/exceptions';
import { User, Order, Transaction } from '@/database/models';
import {
  type IcreditOrder,
  type IUpdateOrder,
} from '@/interfaces/backoffice/orderInterface';
import mongoose from 'mongoose';
import { OrderProgressTemplate, WalletCreditTemplate } from '@/templates';
import { logger } from '@/config/logger';
import { awardPointForTask } from '@/utils/awardPoint';

class OrdersService {
  async getOrders(query: Record<string, any>): Promise<any> {
    // user select options
    const managerBasic = 'email firstname lastname username';
    const {
      page = 1,
      limit = 10,
      name,
      type,
      parentCategory,
      status,
      userId,
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
        { path: 'fund_disbursed_by', select: managerBasic },
      ],
      select: '-password', // remove password from the response
    };
    // pass the query to the paginate function
    const DBquery: Record<string, any> = {
      ...(name && { product_name: name }), // if product name is passed
      ...(type && { type }), // order type
      ...(parentCategory && { parent_category: parentCategory }), // parent category
      ...(status && { status }), // order status
      ...(userId && { user: userId }), // if the userId is passed to fetch orders for a user
      ...(startDate && {
        createdAt: { $gte: new Date(startDate as unknown as Date) },
      }), // if the startDate is passed
      ...(endDate && {
        createdAt: { $lte: new Date(endDate as unknown as Date) },
      }), // if the endDate is passed
    };
    return await paginate(Order, DBquery, options);
  }

  async getOrderById(id: string): Promise<any> {
    const managerBasic = 'email firstname lastname username';
    const order = await Order.findById(id)
      .populate({ path: 'users', strictPopulate: false })
      .populate({ path: 'user', select: managerBasic, strictPopulate: false })
      // .populate("managers") // attach managers to the order (v2 Implementation)
      .populate({
        path: 'attended_by',
        select: managerBasic,
        strictPopulate: false,
      })
      .populate({
        path: 'fund_disbursed_by',
        select: managerBasic,
        strictPopulate: false,
      })
      .exec();
    // this is fetching a single order but populating with the user and managers information if available
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateOrder(data: IUpdateOrder): Promise<any> {
    // Start a session and a transaction
    const session = await mongoose.startSession();
    // set the session options
    session.startTransaction({
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
      maxTimeMS: 30000, // 30 seconds
    });
    // session.startTransaction();

    try {
      // Lock the order for processing by using a query with session
      const order = await Order.findOneAndUpdate(
        { _id: data.orderId, status: { $ne: 'success' } },
        { $set: { status: 'processing' } }, // Optional: set a temporary status
        { new: true },
      ).session(session);

      if (!order) {
        throw new NotFoundException('Order not found or already processed');
      }

      // Get the order user
      const user: any = await User.findById(order.user).session(session);
      if (!user) {
        throw new NotFoundException('Order User not found');
      }

      // Update the order within the session
      await Order.updateOne(
        { _id: data.orderId },
        {
          $set: {
            status: data.status,
            attended_by: data.manager._id,
          },
        },
      ).session(session);

      // Fetch existing transaction document to get current images array
      const existingTransaction = await Transaction.findOne({
        action_id: data.orderId,
      }).session(session);

      // Determine updated images array
      let updatedImages: string[] = [];
      if (existingTransaction && existingTransaction.images) {
        updatedImages = existingTransaction.images;
      }

      if (data.images && data.images.length > 0) {
        updatedImages.push(...(data.images as string[]));
      }
      // Perform update operation on transaction document
      await Transaction.updateOne(
        { action_id: data.orderId },
        {
          $set: {
            status: data.status,
            images: updatedImages,
            description: data.description,
          },
        },
      ).session(session);
      // Commit the transaction
      await session.commitTransaction();
      // End the session
      await session.endSession();
      // process email notification
      const html = OrderProgressTemplate(
        order._id,
        order.type,
        order.product_name,
        order.return_in_usd,
        order.return_in_ngn,
        data.status,
        data.description,
      );
      // send email to user
      await user.sendEmailToUser(
        `Your ${order.product_name} ${order.type === 'coin' ? '' : order.type} sale order ${data.status}`,
        html,
        user.email,
      );
      return await Order.findById(data.orderId);
    } catch (error) {
      // Abort the transaction in case of error
      await session.abortTransaction();
      // End the session
      await session.endSession();
      logger.error(error);
      throw new BadRequestException(
        'An error occurred while processing the order',
      );
    }
  }

  async creditProcessedOrder(data: IcreditOrder): Promise<any> {
    try {
      let orderUpdate: any;
      let userUpdate: any;
      let createdTransaction = {};

      const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        orderUpdate = await Order.findOneAndUpdate(
          { _id: data.orderId, fund_disbursed: false, status: 'success' },
          { fund_disbursed: true, fund_disbursed_by: data.user._id },
          { new: true },
        ).session(session);

        if (!orderUpdate) {
          throw new BadRequestException('Order cannot be credited');
        }

        userUpdate = await User.findOneAndUpdate(
          { _id: orderUpdate.user },
          { $inc: { balance: orderUpdate.return_in_ngn } },
          { new: true },
        ).session(session);

        if (!userUpdate) {
          throw new BadRequestException('Order cannot be credited');
        }

        const parsedAmount = orderUpdate.return_in_ngn;
        const transaction = {
          user: orderUpdate.user,
          action_id: orderUpdate._id,
          name: `Wallet Credit`,
          status: 'success',
          type: 'credit',
          amount: parsedAmount,
          description: `You wallet has been credited with ₦${parsedAmount} for ${orderUpdate.product_name} ${orderUpdate.type} sale.`,
          images: [{ url: '', public_id: '' }],
          balance_before: userUpdate.balance - parsedAmount,
          balance_after: userUpdate.balance,
        };

        createdTransaction = await Transaction.create([transaction], {
          session,
        });

        if (!createdTransaction) {
          throw new BadRequestException('Order cannot be credited');
        }
      });
      await session.endSession();

      // award trading point to the user point balance
      // TODO:: Carefully check to confirm proper implementation
      await awardPointForTask(orderUpdate.user, 'trading');

      const html = WalletCreditTemplate(
        orderUpdate._id,
        orderUpdate.return_in_ngn as number,
        orderUpdate.product_name as string,
        orderUpdate.return_in_usd as number,
        orderUpdate.return_in_ngn as number,
      );
      await userUpdate.sendEmailToUser(
        `Your Wallet has been credited`,
        html,
        userUpdate.email,
      );
      return orderUpdate;
    } catch (error) {
      logger.error(error);
      throw new BadRequestException(
        'An error occurred while processing the order',
      );
    }
  }
}

export default new OrdersService();
