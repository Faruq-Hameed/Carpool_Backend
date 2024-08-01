import { User } from '@/database/models';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@/exceptions';
import {
  type IByUserEmail,
  type IPaginationOptions,
  type IUpdateUser,
  type IUserIdWithPublic,
  type IValue,
} from '@/interfaces/backoffice/userInterface';
import { hashPassword, userPublicFields } from '@/utils/auth';

class UserService {
  /**
   * Creates a new user.
   * @param value - The user data to be created.
   * @returns A promise that resolves to the created user.
   * @throws BadRequestException if the user is deleted.
   * @throws ConflictException if the user already exists.
   */
  async newUser(value: IValue): Promise<any> {
    const existingUser = await User.findOne().or([
      {
        email: value.email,
      },
      { username: value.username },
    ]);
    if (existingUser != null) {
      if (existingUser.isDeleted) {
        throw new BadRequestException(
          'User deleted, details available after 30days',
        );
      }
      throw new ConflictException('User already exists, kindly login');
    }
    value.password = await hashPassword(value.password);
    return await User.create(value);
  }

  /**
   * Retrieves a list of users with pagination options.
   * @param options - The pagination options.
   * @returns A promise that resolves to the list of users.
   */
  async getUsers(options: IPaginationOptions): Promise<any> {
    return await User.find()
      .skip(options.skip)
      .limit(options.limit)
      .select('-password');
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param data - An object containing the user ID and public fields to include.
   * @returns A Promise that resolves to the user object.
   * @throws NotFoundException if the user is not found.
   */
  async getUserById(data: IUserIdWithPublic): Promise<any> {
    const user = await User.findById(data.userId, data.userPublicFields);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Retrieves a user by email or username.
   * @param data - The data containing the email or username to search for.
   * @returns A Promise that resolves to the user object if found.
   * @throws NotFoundException if the user is not found.
   */
  async getUserByEmailOrUsername(data: IByUserEmail): Promise<any> {
    const user = await User.findOne(
      { $or: [{ email: data.email }, { username: data.username }] },
      userPublicFields,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Updates a user with the provided data.
   * @param data - The data to update the user with.
   * @returns A Promise that resolves to the updated user.
   * @throws ConflictException if the email already exists for another user.
   */
  async updateUser(data: IUpdateUser): Promise<any> {
    const existingUser = await User.findOne({ _id: data.userId }, '_id email');
    if (existingUser !== null && existingUser._id !== data.userId) {
      throw new ConflictException(`email,${data.value.email} already exists`);
    }
    return await User.findByIdAndUpdate(
      data.id,
      { ...data.value },
      { new: true },
    );
  }

  /**
   * Deletes a user by setting the `isDeleted` flag to `true`.
   * @param userId - The ID of the user to delete.
   * @returns A Promise that resolves to the updated user object.
   */
  async deleteUser(userId: string): Promise<any> {
    return await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true },
    );
  }
}

export default new UserService();
