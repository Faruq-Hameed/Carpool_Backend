import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ProductService from '@/services/backoffice/productService';
import RateService from '@/services/backoffice/rateService';
import ContentService from '@/services/backoffice/contentService';

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { id } = req.params;
  try {
    const product = await ProductService.fetchOneProduct(id);
    return res.status(StatusCodes.OK).json({
      message: 'Product Retrieved',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const managers = await ProductService.fetchAllProducts(req.query);
    return res.status(StatusCodes.OK).send({
      message: 'All Products Retrieved',
      data: managers,
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

export const getAllContents = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const contents = await ContentService.fetchContents(req.query);
    return res.status(StatusCodes.OK).json({
      message: 'All Contents Retrieved',
      data: contents,
    });
  } catch (error) {
    next(error);
  }
};

export const getContentByName = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { name } = req.params;
  try {
    const content = await ContentService.getContentByName(name);
    return res.status(StatusCodes.OK).json({
      message: 'Content Retrieved',
      data: content,
    });
  } catch (error) {
    next(error);
  }
};
