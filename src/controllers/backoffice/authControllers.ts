import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import createHttpError, { type UnknownError } from 'http-errors';
import AuthService from '@/services/backoffice/authService';
import {
  managerChangePassValidator,
  managerLoginValidator,
} from '@/utils/joiSchemas';
import {
  type IManagerChangePass,
  type IManagerLogin,
} from '@/interfaces/backoffice/authInterface';
import { type ManagerPayload } from '@/utils/types/payload';

/** Login api controller */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { value, error } = managerLoginValidator(
      req.body as Partial<IManagerLogin>,
    );
    if (error) {
      next(
        createHttpError(
          StatusCodes.BAD_REQUEST,
          error.details[0].message as UnknownError,
        ),
      );
      return;
    }
    const manager = await AuthService.login(value as IManagerLogin);
    req.manager = manager.manager as ManagerPayload;

    res.send({
      message: 'Login Success!',
      data: manager,
    });
    next(); // calling the next middleware(loginActivity)
  } catch (err) {
    next(err);
  }
};

export const passwordChange = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { value, error } = managerChangePassValidator(
      req.body as Partial<IManagerChangePass>,
    );

    if (error) {
      next(
        createHttpError(
          StatusCodes.BAD_REQUEST,
          error.details[0].message as UnknownError,
        ),
      );
      return;
    }
    await AuthService.changePassword(value as IManagerChangePass, req.manager);
    return res.send({
      message: 'Password Change Successfully!',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const passwordReset = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const managerId = req.params.id;
    const resetPassword = await AuthService.resetPassword(managerId);
    return res.send({
      message: 'Password Reset Successfully!',
      data: resetPassword,
    });
  } catch (err) {
    next(err);
  }
};
