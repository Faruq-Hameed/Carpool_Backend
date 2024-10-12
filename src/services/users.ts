import { type IUser } from '@/utils/types/user';
import { User } from '@/database';
import { ConflictError, NotFoundError } from '@/utils/errors';
import Otp from '@/database/otp';
import sendEmail from '@/utils/mail';
import crypto from 'crypto';

class UserService {
  /** Create a user service */
  async createUser(data: IUser): Promise<IUser> {
    const existingUser = await this.getUser(
      {
        $or: [
          { email: data.email },
          { phonenumber: data.phonenumber },
          { username: data.username },
        ],
      },
      '_id',
    );
    if (existingUser) {
      throw new ConflictError('user already exists');
    }
    return await User.create(data);
  }

  // NOT EXPOSED YET BECAUSE OF KYC
  private async updateUserData(
    data: Partial<IUser>,
    userId: string,
  ): Promise<any> {
    // if username is passed in, check if it doesn't belong to another user
    if (data.username) {
      const existingUser = await this.findAUser(
        { username: data.username },
        '_id',
      );
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictError('username already exists for another user');
      }
    }

    // if email is passed in, check if it doesn't belong to another user
    if (data.email) {
      const existingUser = await this.findAUser({ email: data.email }, '_id');
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictError('email already exists for another user');
      }
    }

    // if phonenumber is passed in, check if it doesn't belong to another user
    if (data.phonenumber) {
      const existingUser = await this.findAUser(
        { phonenumber: data.phonenumber },
        '_id',
      );
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictError('phonenumber already exists for another user');
      }
    }

    return {
      message: 'Updated successful',
      data: await User.findByIdAndUpdate(userId, data, { new: true }),
    };
  }

  /** Get user(s) by any param */
  async getUser(query: Record<string, any>, select?: string): Promise<IUser[]> {
    const result = await User.find(query, select);
    return result;
  }

  /** Find a user by any param */
  async findAUser(
    query: Record<string, any>,
    select?: string,
  ): Promise<IUser | null> {
    return await User.findOne(query, select);
  }

  /** Create otp document */
  async createOtp(data: Record<string, any>): Promise<any> {
    const existingUser = await this.getUser({ ...data });

    if (!existingUser) {
      throw new NotFoundError('User not found kindly sign up');
    }

    const code = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP

    // mail option if the key is email
    const emailOption = {
      to: data.email,
      subject: 'Your lyft otp ',
      message: `Your lyft otp is ${code} kindly use. \n 
            The code will expire after 5 minutes `,
    };

    // send otp to email address
    const otpDoc = await Otp.create({ channel: { ...data }, code });
    await sendEmail(emailOption); // if email is true
    // phonenumber otp will be added here later
    return otpDoc;
  }

  /** Verify if the otp exist */
  async verifyOtp(query: Record<string, any>): Promise<boolean> {
    const otp = await Otp.findOneAndDelete({ ...query });
    return !!otp;
  }
}

export default new UserService();
