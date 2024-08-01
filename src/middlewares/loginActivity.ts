import { logger } from '@/config/logger';
import { LoginActivity } from '@/database/models';
import { type Request, type Response, type NextFunction } from 'express';

const storeLoginActivity = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const managerId = req.manager?._id;
  const ipAddress = req.ip ?? managerId;

  try {
    // Create a login activity record
    const loginActivity = new LoginActivity({
      manager_id: managerId,
      ipAddress,
    });

    await loginActivity.save();
  } catch (error) {
    // logger.error(error);
    logger.error(
      `${error as any} - Failed to log activity, ${managerId as any}`,
    );
  }
};

export default storeLoginActivity;
