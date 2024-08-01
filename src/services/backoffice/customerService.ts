import { BadRequestException, NotFoundException } from '@/exceptions';
import {
  User as Customer,
  Transaction,
  CustomerNote,
  type ICustomerNote,
} from '@/database/models';
import { paginate, type SortOption } from '@/utils/common';
import { UserStatus as CustomerStatus } from '@/utils/types';
import { type IObject, type DateRange } from '@/utils/types/general';

/** Customer Service */
class CustomerService {
  /** Get a list of customers */
  async getCustomersList(query: IObject): Promise<any> {
    // Extract page and limit from query parameters, with default values
    const {
      page = '1',
      limit = '10',
      startDate,
      endDate,
      minBalance,
      maxBalance,
      ...otherFields
    } = query;
    const sort: SortOption = { createdAt: -1 };
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort,
      select: '-password', // remove password from query
    };
    const DBquery = { ...otherFields }; // other fields used to filter

    // If minBalance or maxBalance is provided, add them to the query
    if (minBalance !== undefined || maxBalance !== undefined) {
      // Initialize an empty object for the balance field in the query
      DBquery.balance = {
        ...(minBalance !== undefined && {
          $gte: parseFloat(minBalance as string),
        }),
        ...(maxBalance !== undefined && {
          $lte: parseFloat(maxBalance as string),
        }),
      };
    }

    // If startDate or endDate is provided, add them to the query
    if (startDate !== undefined || endDate !== undefined) {
      DBquery.createdAt = {
        ...(startDate !== undefined && { $gte: new Date(startDate as Date) }),
        ...(endDate !== undefined && { $lte: new Date(endDate as Date) }),
      };
    }

    // Fetch paginated users using the paginate utility function
    return await paginate(Customer, DBquery, options);
  }

  /** get unverified users */
  async getUnVerifiedCustomers(query: IObject): Promise<any> {
    const { page = '1', limit = '10' } = query;
    const sort: SortOption = { createdAt: -1 };

    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort,
      select:
        'firstname lastname username email phonenumber createdAt isPhoneVerified isEmailVerified', // the needed fields
    };
    // const DBquery = { createdAt: { $gte: startDate, $lte: endDate }, $or: [{ isPhoneVerified: false }, { isEmailVerified: false }] }

    // all time unverified customers
    const DBquery = {
      $or: [{ isPhoneVerified: false }, { isEmailVerified: false }],
    };

    // Fetch paginated users using the paginate utility function
    return (await paginate(Customer, DBquery, options)) ?? 0;
  }

  /** service to get manager by id with select options */
  async getCustomerById(
    customerId: string,
    select: IObject = { password: 0 },
  ): Promise<any> {
    const customer = await Customer.findById(customerId, select);
    if (!customer) {
      throw new NotFoundException('customer not found');
    }
    return customer;
  }

  /** service to get total customers balance */
  async getTotalBalance(): Promise<any> {
    const aggregationResult = await Customer.aggregate([
      {
        $group: {
          // grouping the aggregation
          _id: null,
          totalBalance: { $sum: '$balance' },
        },
      },
    ]);

    // if no customer is available then the result is expected to be empty
    if (aggregationResult.length === 0) {
      return 0;
    }
    // extract the total amount from
    return { outstandingBalance: aggregationResult[0].totalBalance };
  }

  /** error message method for customer status update */
  getStatusChangeMessage = (currentStatus: string): string => {
    switch (currentStatus) {
      case CustomerStatus.active:
        return 'You can only update active status to restricted or blocked';
      case CustomerStatus.restricted:
        return 'You can only update restricted status to active or blocked';
      case CustomerStatus.blocked:
        return 'You can only update blocked status to active or restricted';
      default:
        return 'Invalid status';
    }
  };

  /** service to get manager by id */
  async updateCustomerStatus(
    customerId: string,
    newStatus: string,
  ): Promise<any> {
    const customer = await Customer.findById(customerId, '-password');
    if (!customer) {
      throw new NotFoundException('customer not found');
    }

    // if the new status is the same with the existing status
    if (customer.user_status === newStatus.toLowerCase()) {
      throw new Error(this.getStatusChangeMessage(customer.user_status));
    }
    await Customer.findByIdAndUpdate(
      customerId,
      { user_status: newStatus },
      { new: true },
    );
    customer.user_status = newStatus as CustomerStatus;
    return customer;
  }

  /** Service to get total transaction created within a period */
  async getTotalActiveCustomers({
    startDate,
    endDate,
  }: DateRange): Promise<number> {
    const result = await Transaction.aggregate([
      {
        $match: {
          // match documents created within the ranger
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          // grouping documents from the same user a user only appear once
          _id: '$user',
        },
      },
      {
        $count: 'totalActiveCustomers',
      },
    ]);

    return result.length > 0 ? result[0].totalActiveCustomers : 0;
  }

  /** Service to get untransacted customers */

  async fetchUntransactedCustomers({
    startDate,
    endDate,
  }: DateRange): Promise<any> {
    /** get customers that haven't transacted yet from orders collection */
    const untransactedCustomers = await Customer.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders', // create a new field as array to contain the orders created
        },
      },
      {
        $match: {
          orders: { $size: 0 }, // match only users that orders size is 0
        },
      },
      {
        // the fields to select
        $project: {
          _id: 1,
          firstname: 1,
          lastname: 1,
          username: 1,
          email: 1,
        },
      },
    ]);

    /** All orders with pending or declined status for different users */
    const customersWithNoSuccessOrders = await Customer.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'orders',
          as: 'orders',
        },
      },
      {
        // select orders with status of declined or pending with the date range
        $match: {
          createdAt: { $gt: startDate, $lt: endDate },
          'orders.status': { $ne: 'success' },
        },
      },
      {
        // select fields to return
        $project: {
          _id: 1,
          firstname: 1,
          lastname: 1,
          username: 1,
          email: 1,
        },
      },
    ]);

    // combine the documents and select the unique users
    const combinedCustomersDocs = [
      ...untransactedCustomers,
      ...customersWithNoSuccessOrders,
    ];

    if (combinedCustomersDocs.length > 0) {
      // Create a Set of unique _id strings by mapping each document's _id to a string
      const uniqueIds = new Set(
        combinedCustomersDocs.map(c => c._id.toString()),
      );

      // Convert the Set of those unique _id strings back to an array of unique documents
      const uniqueCustomers = Array.from(uniqueIds).map(id =>
        // for each unique _id string, find the corresponding document in combinedCustomersDocs
        combinedCustomersDocs.find(c => c._id.toString() === id),
      );

      // Return the array of unique documents based on their _id
      return uniqueCustomers;
    }

    // Step 5: Return an empty array if combinedCustomersDocs is empty
    return [];

    // const combinedCustomersDocs = [...untransactedCustomers, ...customersWithNoSuccessOrders]
    // if (combinedCustomersDocs.length > 0) {
    //   const uniqueCustomers = combinedCustomersDocs.filter(
    //   (customer, index, self) => index === self.findIndex((c) => c._id.toString() === customer._id.toString())
    // );
    // return uniqueCustomers

    // }

    // return []
  }

  /** Add a new note to customer note list by a manager */
  async addCustomerNote(data: IObject): Promise<ICustomerNote> {
    const { managerId, customerId, note } = data;
    // check if customer exist
    await this.getCustomerById(customerId as string, { _id: 1 });

    // create the new note document
    const newNote = await CustomerNote.create({ customerId, managerId, note });
    if (!newNote) {
      throw new BadRequestException('unable to add a new note');
    }
    return newNote;
  }

  /** Fetch a customer notes */
  async fetchCustomerNotes(customerId: string, query: IObject): Promise<any> {
    // check if customer exist
    await this.getCustomerById(customerId, { _id: 1 });
    const { page = '1', limit = '10' } = query;
    const sort: SortOption = { createdAt: -1 };
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort,
    };

    // Fetch paginated users using the paginate utility function
    return await paginate(CustomerNote, { customerId }, options);
  }
}

export default new CustomerService();
