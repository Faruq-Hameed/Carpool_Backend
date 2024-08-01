import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import createHttpError, { type UnknownError } from 'http-errors';
import { productValidator } from '@/utils/joiSchemas';
import ProductService from '@/services/backoffice/productService';
import { type INewProduct } from '@/interfaces/backoffice/productInterface';

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { error, value } = productValidator(req.body);
    if (error !== null && error !== undefined) {
      next(
        createHttpError(
          StatusCodes.BAD_REQUEST,
          error.details[0].message as UnknownError,
        ),
      );
      return;
    }
    const newProduct = await ProductService.addNewProduct(value as INewProduct);
    return res.status(StatusCodes.CREATED).json({
      message: 'Product added successfully',
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

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

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { error, value } = productValidator(req.body, true);
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
    const updatedProduct = await ProductService.updateProduct(
      id,
      value as INewProduct,
    );
    return res.status(StatusCodes.OK).send({
      message: 'Product Updated',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { id } = req.params;
  try {
    await ProductService.deleteProduct(id);
    return res.status(StatusCodes.OK).json({
      message: 'Product Deleted',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
