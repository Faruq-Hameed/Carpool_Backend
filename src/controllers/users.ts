// import { User } from "@/database";
import { type Request, type Response, type NextFunction } from 'express';
import { UserService } from '@/services/';
import { userValidator } from '@/utils/validations/userValidations';
import { BadRequestError } from '@/utils/errors';
import { type IUser } from '@/utils/types/user';

const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { value, error } = userValidator(req.body as Partial<IUser>);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }
    const user = await UserService.createUser(value as IUser);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await UserService.getUser({ ...req.query });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const createOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, phonenumber } = req.body;
    if (!phonenumber && !email) {
      throw new BadRequestError('Email Provided or Phone Number Required');
    }
    /** channel where the otp will be sent to */
    const channel = email ? { email } : { phonenumber };
    const otp = await UserService.createOtp({ ...channel });

    res.status(200).send({
      message:
        'Otp created successfully, please check your email or phonenumber',
      otp,
    });
  } catch (err) {
    next(err);
  }
};

/** Controller to verify otp if true delete the otp after verification */
const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { phonenumber, email, code } = req.body;

    if (!phonenumber && !email) {
      throw new BadRequestError('Email Provided or Phone Number Required');
    }

    // this verification can handle for email and phone number
    const channel = email ? { email } : { phonenumber };

    const isValid = await UserService.verifyOtp({ channel, code });
    if (!isValid) {
      throw new BadRequestError('Invalid OTP or Email Provided');
    }
    res.status(200).send({ message: 'Otp verified' });
  } catch (err) {
    next(err);
  }
};
// }

export { createUser, getUser, createOtp, verifyOtp };
