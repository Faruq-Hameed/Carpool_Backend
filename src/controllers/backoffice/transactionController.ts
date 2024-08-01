import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import TransactionService from '@/services/backoffice/transactionService';

export const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const transactions = await TransactionService.getTransactions(req.query);
    return res.status(StatusCodes.OK).send({
      message: 'Transactions retrieved',
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const transactions = await TransactionService.getUserTransactions({
      ...req.query,
      userId: req.params.id,
    });
    return res.status(StatusCodes.OK).send({
      message: 'User Transactions retrieved',
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const transaction = await TransactionService.getTransactionById(
      req.params.id,
    );
    return res.status(StatusCodes.OK).send({
      message: 'Transaction retrieved',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};
