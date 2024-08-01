import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
// import { type IUser, User } from '../database/models';
import CustomerService from '@/services/backoffice/customerService';
import { customerStatusValidator } from '@/utils/joiSchemas/userJoiSchema';
import { isValidDate, type SortOption } from '@/utils/common';
import { dateRangeValidator } from '@/utils/dateRange';
import { BadRequestException } from '@/exceptions';
// import { dateRangeValidator } from '@/utils/dateRange';

/** Get all customers with pagination */
const getAllCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const customers = await CustomerService.getCustomersList(req.query);
    res.status(StatusCodes.OK).send({
      message: 'customers available',
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

/** Get customer by id controller */
const getCustomerById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // get the customer document from Customer Service
    const customer = await CustomerService.getCustomerById(req.params.id, {
      password: 0,
    });
    res
      .status(StatusCodes.OK)
      .send({ message: 'customer found', data: customer });
  } catch (error) {
    next(error);
  }
};

/** Controller  to get total money in all customers wallet */
const getOutstandingBalance = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const outstandingBalance = await CustomerService.getTotalBalance();
    res.status(StatusCodes.OK).send({
      message: 'total outstanding balance available',
      data: outstandingBalance,
    });
  } catch (error) {
    next(error);
  }
};

/** Controller to change user status */
const updateCustomerStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { error } = customerStatusValidator(req.body);
    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
    }
    const { status } = req.body;

    const customer = await CustomerService.updateCustomerStatus(
      req.params.id,
      status as string,
    );
    res
      .status(StatusCodes.OK)
      .send({ message: `customer status now ${status}`, data: customer });
  } catch (error) {
    next(error);
  }
};

/** Get total customers that transacted within a period controller */
const getTotalActiveWithinPeriod = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      // simple validation
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: 'startDate and endDate are required' });
      return;
    }

    // check if the query parameters are valid date types
    if (!isValidDate(startDate as string) || !isValidDate(endDate as string)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: 'Invalid date format' });
      return;
    }

    const dateRange = {
      startDate: new Date(startDate as string),
      endDate: new Date(endDate as string),
    };

    const activeCustomers =
      await CustomerService.getTotalActiveCustomers(dateRange);
    res.status(StatusCodes.OK).send({
      message: 'total active customers data available',
      data: activeCustomers,
    });
  } catch (error) {
    next(error);
  }
};

/** Get all customers with pagination */
const getUnverifiedCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // all time unverified customers will be returned with pagination
    const customers = await CustomerService.getUnVerifiedCustomers(req.query);

    res.status(StatusCodes.OK).send({
      message: 'unverified customers available',
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

/** Get all untransacted customers */
const getUnTransactedCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    const dateRange = dateRangeValidator({
      ...(startDate && { startDate: startDate as string }),
      ...(endDate && { endDate: endDate as string }),
    });
    // all unverified customers
    const customers =
      await CustomerService.fetchUntransactedCustomers(dateRange);

    res.status(StatusCodes.OK).send({
      message: 'untransacted customers available',
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

/** controller to get user notes */
const getCustomerNotes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const sort: SortOption = { createdAt: -1 };
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort,
    };

    // fetch the notes with pagination
    const notes = await CustomerService.fetchCustomerNotes(
      req.params.customerId,
      options,
    );

    res
      .status(StatusCodes.OK)
      .send({ message: 'Customer notes available', data: notes });
  } catch (error) {
    next(error);
  }
};

/** Get customer by id controller */
const createCustomerNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // validate the req.body no need for joi since it is a simple validation
    if (!req.body.note) {
      throw new BadRequestException('!notes missing');
    }

    // create the new note
    const newNote = await CustomerService.addCustomerNote({
      managerId: req.manager?._id,
      customerId: req.params.customerId,
      note: req.body.note,
    });

    res
      .status(StatusCodes.OK)
      .send({ message: 'new note added', data: newNote });
  } catch (error) {
    next(error);
  }
};

export {
  getAllCustomers,
  getCustomerById,
  getOutstandingBalance,
  updateCustomerStatus,
  getTotalActiveWithinPeriod,
  getUnverifiedCustomers,
  getUnTransactedCustomers,
  getCustomerNotes,
  createCustomerNote,
};
