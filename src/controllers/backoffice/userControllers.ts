import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import createHttpError, { type UnknownError } from 'http-errors';
import { userValidator } from '@/utils/joiSchemas';
import { userPublicFields } from '@/utils/auth';
import userService from '@/services/backoffice/userService';
import { type IValue } from '@/interfaces/backoffice/userInterface'; // Import the IValue type from the appropriate location
import { BadRequestException } from '@/exceptions';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { error, value }: { error: any; value: IValue } = userValidator(
      req.body,
    ); // Explicitly type the value variable as IValue
    if (error) {
      next(
        createHttpError(
          StatusCodes.BAD_REQUEST,
          error.details[0].message as UnknownError,
        ),
      );
      return;
    }
    const user = await userService.newUser(value);
    return res.status(StatusCodes.CREATED).json({
      message: 'User created successfully',
      data: user,
    });
  } catch (error: unknown) {
    next(error);
  }
};

/** get all users controller */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const limit = parseInt(req.query.limit as string) || 8;
    const skip = parseInt(req.query.skip as string) || 0;
    const users = await userService.getUsers({ limit, skip });
    return res.status(StatusCodes.OK).json({
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (err) {
    next(err);
  }
};
/** Get a single user by id */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById({ userId, userPublicFields });
    return res.status(StatusCodes.OK).send({
      message: 'User fetched successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

/** Get user by email or username */
export const getUserByUsernameOrEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const email: string = req.query.email as string;
  const username: string = req.query.username as string;
  // validate email or username
  if (!email && !username) {
    throw new BadRequestException('email or username is required');
  }
  try {
    const user = await userService.getUserByEmailOrUsername({
      email,
      username,
    });
    return res.status(StatusCodes.OK).send({
      message: 'User fetched successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

/** Update user data  */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { error, value } = userValidator(req.body);

    const userId = req.params.id;
    if (error) {
      next(
        createHttpError(
          StatusCodes.BAD_REQUEST,
          error.details[0].message as UnknownError,
        ),
      );
      return;
    }

    const user = await userService.updateUser({
      userId,
      id: req.params.id,
      value,
    });
    return res.status(StatusCodes.OK).json({
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/** Delete user controller */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    await userService.deleteUser(req.params.id);
    return res.status(StatusCodes.GONE).json({
      message: 'User deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// trying to fix destructure error
// error cast - C:\laragon\www\myEcurrencyWorkspace\myecurrency-backend-node-v2\src\routes\userRoutes.ts:6
// getAllUsers,
//   ^
//   TypeError: Cannot destructure property 'getAllUsers' of 'controllers_1.userController' as it is undefined.
// export const userController = {
//   createUser,
//   getAllUsers,
//   getUserById,
//   getUserByUsernameOrEmail,
//   updateUser,
//   deleteUser,
// };
