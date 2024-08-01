import { type NextFunction, type Request, type Response } from 'express';
import createHttpError, { type UnknownError } from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import { type IManager } from '@/database/models';
import { managerValidator } from '@/utils/joiSchemas';
import ManagerService from '@/services/backoffice/managerService';
import { dateRangeValidator } from '@/utils/dateRange';

/** Create a new manager */
const createManager = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { value, error } = managerValidator(req.body as Partial<IManager>);

    if (error) {
      next(
        createHttpError(
          StatusCodes.BAD_REQUEST,
          error.details[0].message as UnknownError,
        ),
      );
      return;
    }
    // check if manager already exist
    const manager = await ManagerService.createManager(value as IManager);
    return res.status(StatusCodes.OK).send({
      message: 'manager created successfully',
      data: manager,
    });
  } catch (error) {
    next(error);
  }
};

/** Get a user by id */
const getManagerById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const manager = await ManagerService.getManagerById(req.params.id);
    return res.status(StatusCodes.OK).send({
      message: 'Manager available',
      data: manager,
    });
  } catch (error) {
    next(error);
  }
};

/** Controller to get all managers sorted by creation date with pagination */
const getAllManagers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const managers = await ManagerService.getAllManagers(req.query);
    return res.status(StatusCodes.OK).send({
      message: 'managers available',
      data: managers,
    });
  } catch (error) {
    next(error);
  }
};

/** Update manager */
const updateManager = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { value, error } = managerValidator(
      req.body as Partial<IManager>,
      true,
    );
    const managerId = req.params.id;
    if (error) {
      next(
        createHttpError(
          StatusCodes.BAD_REQUEST,
          error.details[0].message as UnknownError,
        ),
      );
      return;
    }
    const manager = await ManagerService.updateManager(
      managerId,
      value as IManager,
    );
    return res.status(StatusCodes.OK).send({
      message: 'Manager updated',
      data: manager,
    });
  } catch (error) {
    next(error);
  }
};

/** Delete a manager */
const deleteAManager = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    await ManagerService.deleteManager(req.params.id);
    return res.status(StatusCodes.GONE).send({
      message: 'Manager Deleted',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/** Get manager login activities with date ranage */
const getLoginActivities = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const managerId = req.params.id;
  const { startDate, endDate, page, limit } = req.query;
  const dateRange = dateRangeValidator({
    ...(startDate && { startDate: startDate as string }),
    ...(endDate && { endDate: endDate as string }),
  });

  const loginActivities = await ManagerService.fetchManagerLoginActivities({
    ...dateRange,
    managerId,
    page,
    limit,
  });
  res.status(StatusCodes.OK).send({
    message: 'managers login activity available',
    data: loginActivities,
  });
  
};
export {
  getManagerById,
  createManager,
  getAllManagers,
  deleteAManager,
  updateManager,
  getLoginActivities,
};
