import { ConflictException, NotFoundException } from '@/exceptions';
import {
  type IManager,
  Manager,
  LoginActivity,
  type ILoginActivity,
} from '@/database/models';
import {
  paginate,
  type SortOption,
  type PaginatedResult,
  type PaginateOptions,
} from '@/utils/common';

/** Manager service */
class ManagerService {
  /** Creates a new manager service */
  async createManager(data: IManager): Promise<any> {
    // check if manager already exist
    const existingManager = await Manager.findOne(
      {
        $or: [
          { email: data.email },
          { username: data.username },
          { phonenumber: data.phonenumber },
        ],
      },
      '_id', // select only id
    );
    if (existingManager) {
      throw new ConflictException('Manager already exists');
    }
    const manager = await Manager.create(data);
    manager.password = '';
    return manager;
  }

  /** service to get manager by id */
  async getManagerById(managerId: string): Promise<any> {
    const manager = await Manager.findById(managerId, { password: 0 });
    if (!manager) {
      throw new NotFoundException('Manager not found');
    }
    return manager;
  }

  /** update manger information */
  async updateManager(
    managerId: string,
    data: Partial<IManager>,
  ): Promise<any> {
    // if email and or username wants to be updated
    if (data.email ?? data.username ?? data.phonenumber) {
      // check if any of the fields is not for another user
      const existingManager = await Manager.findOne(
        {
          $or: [
            { email: data.email },
            { username: data.username },
            { phonenumber: data.phonenumber },
          ],
          _id: { $ne: managerId },
        },
        '_id',
      );
      if (existingManager) {
        throw new ConflictException(
          'Credential already exists for another user',
        );
      }
    }
    const manager = await Manager.findByIdAndUpdate(managerId, data, {
      new: true,
    }).select('-password');
    if (!manager) {
      throw new NotFoundException('Manager not found');
    }
    return manager;
  }

  /** Deletes a manager by their ID. */
  async deleteManager(managerId: string): Promise<any> {
    const manager = await Manager.findByIdAndDelete(managerId);
    if (!manager) {
      throw new NotFoundException('Manager not found');
    }
    return manager;
  }

  /**
   * Retrieves all managers based on the provided query parameters.
   * @param query - The query parameters used for filtering and pagination.
   * @returns A Promise that resolves to an array of managers.
   */
  async getAllManagers(query: Record<string, any>): Promise<any> {
    // Extract page and limit from query parameters, with default values
    const { page = '1', limit = '10', ...otherFields } = query;
    const sort: SortOption = { createdAt: -1 };
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort,
      select: '-password', // remove password from query
    };
    const DBquery = { ...otherFields }; // other fields used to filter

    // Fetch paginated managers using the paginate utility function
    return await paginate(Manager, DBquery, options);
  }

  async fetchManagerLoginActivities(
    query: Record<string, any>,
  ): Promise<PaginatedResult<ILoginActivity>> {
    const { startDate, endDate, page, limit, managerId } = query;
    const sort: SortOption = { createdAt: -1 };
    // find all docs that belong to the manager created within the specified date range
    const dbQuery = {
      manager_id: managerId,
      createdAt: { $gt: startDate, $lt: endDate },
    };

    const options: PaginateOptions = {
      ...(page && { page: parseInt(page as string, 10) }),
      ...(limit && { limit: parseInt(limit as string, 10) }), // default limit if not specified
      sort,
    };
    return await paginate(LoginActivity, dbQuery, options);
  }
}

export default new ManagerService();
