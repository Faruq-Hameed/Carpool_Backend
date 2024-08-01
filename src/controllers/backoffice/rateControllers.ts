import type { Request, Response, NextFunction } from 'express';
import createHttpError, { type UnknownError } from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import rateValidator from '@/utils/joiSchemas/rateJoiSchema';
import RateService from '@/services/backoffice/rateService';
import type { INewRate } from '@/interfaces/backoffice/rateInterface';

export const addRate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { value, error } = rateValidator(req.body);
    if (error !== null && error !== undefined) {
      next(
        createHttpError(
          StatusCodes.BAD_REQUEST,
          error.details[0].message as UnknownError,
        ),
      );
      return;
    }
    const newRate = await RateService.addNewRate(value as INewRate);
    return res.status(StatusCodes.CREATED).json({
      message: 'Rate added successfully',
      data: newRate,
    });
  } catch (error) {
    next(error);
  }
};

export const getRate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { id } = req.params;
  try {
    const rate = await RateService.fetchOneRate(id);
    return res.status(StatusCodes.OK).json({
      message: 'Rate Retrieved',
      data: rate,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRates = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const rates = await RateService.fetchAllRates(req.query);
    return res.status(StatusCodes.OK).send({
      message: 'All Rates Retrieved',
      data: rates,
    });
  } catch (error) {
    next(error);
  }
};

export const getRatesByProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const productId = req.params.id;
  req.query.productId = productId;
  try {
    const rates = await RateService.fetchRatesByProduct(req.query);
    return res.status(StatusCodes.OK).send({
      message: 'Rates Retrieved',
      data: rates,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { error, value } = rateValidator(req.body, true);
    if (error !== null && error !== undefined) {
      next(
        createHttpError(
          StatusCodes.BAD_REQUEST,
          error.details[0].message as UnknownError,
        ),
      );
      return;
    }
    const { id } = req.params;
    const updatedRate = await RateService.updateRate(id, value as INewRate);
    return res.status(StatusCodes.OK).send({
      message: 'Rate Updated',
      data: updatedRate,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { id } = req.params;
  try {
    await RateService.deleteRate(id);
    return res.status(StatusCodes.OK).json({
      message: 'Rate Deleted',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
