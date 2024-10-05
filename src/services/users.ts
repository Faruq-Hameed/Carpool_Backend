import { type IUser } from '@/utils/types/user';
import { User } from '@/database';
import { ConflictError, NotFoundError } from '@/utils/errors';
import Otp from '@/database/otp';
import sendEmail from '@/utils/mail';
import crypto from 'crypto';

class UserService {
  /** Get a user by any param */
  async getUser(
    query: Record<string, any>,
    select?: string,
  ): Promise<any[] | boolean> {
    const result = await User.find(query, select);
    if (result.length === 0) {
      return false;
    }
    return result;
  }

  /** Create a user service */
  async createUser(data: IUser): Promise<IUser> {
    const existingUser = await this.getUser(
      { $or: [{ email: data.email }, { phonenumber: data.phonenumber }] },
      '_id',
    );
    // existingUser =   {}
    if (existingUser) {
      // if
      throw new ConflictError('user already exists');
    }
    return await User.create(data);
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
