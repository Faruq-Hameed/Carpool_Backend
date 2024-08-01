import OrdersService from '@/services/backoffice/orderService';
import type { Response, Request, NextFunction } from 'express';
import { type Files } from 'formidable';
import { StatusCodes } from 'http-status-codes';
import createHttpError, { type UnknownError } from 'http-errors';
import { updateOrdersValidator } from '@/utils/joiSchemas';
import { uploadImages } from '@/utils';
import { type IUpdateOrder } from '@/interfaces/backoffice/orderInterface';
import type { ObjectId } from 'mongoose';

export const fetchOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const orders = await OrdersService.getOrders(req.query);
    return res.status(StatusCodes.OK).json({
      message: 'Orders retrieved',
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const order = await OrdersService.getOrderById(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: 'Order retrieved',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { id } = req.params;
    // get files from the multer middleware
    // validate the fields
    const { value, error } = updateOrdersValidator(req.body);
    if (error) {
      next(
        createHttpError(
          StatusCodes.BAD_REQUEST,
          error.details[0].message as UnknownError,
        ),
      );
      return;
    }
    let storedImages: Array<{ url: string; publicId: string }> = [];

    if (req.files) {
      storedImages = await uploadImages(req.files as unknown as Files<string>, [
        'images',
      ]);
    }
    value.orderId = id;
    value.user = req.manager;
    value.images = storedImages;

    const result = await OrdersService.updateOrder(value as IUpdateOrder);
    return res.status(StatusCodes.OK).json({
      message: 'Order Processed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const creditOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const order = await OrdersService.creditProcessedOrder({
      orderId: req.params.id as unknown as ObjectId,
      user: req.user,
    });
    return res.status(StatusCodes.OK).json({
      message: 'Order Credit Processed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
