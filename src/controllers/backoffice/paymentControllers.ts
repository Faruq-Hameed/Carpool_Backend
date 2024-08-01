import type { Response, Request, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import createHttpError, { type UnknownError } from 'http-errors';
import PaymentService from '@/services/backoffice/paymentService';
import { updatePaymentValidator } from '@/utils/joiSchemas';
import { type IUpdatePayment } from '@/interfaces/backoffice/paymentInterface';
export const fetchPayments = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const payments = await PaymentService.getPayments(req.query);
    return res.status(StatusCodes.OK).json({
      message: 'Payments retrieved',
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchPaymentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const payment = await PaymentService.getPaymentById(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: 'Payment retrieved',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    req.body.paymentId = req.params.id;
    req.body.user = { _id: '60f1b3b3b3f1f3b3b3f1f3b3' };
    // req.user;

    const { error, value } = updatePaymentValidator(req.body);
    if (error !== null && error !== undefined) {
      next(
        createHttpError(
          StatusCodes.BAD_REQUEST,
          error.details[0].message as UnknownError,
        ),
      );
      return;
    }
    const payment = await PaymentService.updatePaymentRequest(
      value as IUpdatePayment,
    );
    return res.status(StatusCodes.OK).json({
      message: 'Payment Updated',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};
