import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AnalyticService from '@/services/backoffice/analyticsService';
import CustomerService from '@/services/backoffice/customerService';

import { type TopTraders } from '@/utils/types';
import { dateRangeValidator } from '@/utils/dateRange';

// import { Order } from '@/database/models';

const getUserAnalyticsSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    // validate the specified date range if available or get defaults date
    const dateRange = dateRangeValidator({
      ...(startDate && { startDate: startDate as string }),
      ...(endDate && { endDate: endDate as string }),
    });

    // Update startDate with hard-coded Unix epoch start date for lifeTimeActiveUsersCount
    const epochDateRange = {
      ...dateRange,
      startDate: new Date('1970-01-01T00:00:00Z'),
    };

    const [
      outstandingBalance, // total customer balance as at today
      usersAnalyticsSummary,
      activeUsersCount, // Get total active users counts within the time frame
      lifeTimeActiveUsersCount, // Get total active users counts over lifetime
    ] = await Promise.all([
      CustomerService.getTotalBalance(),
      AnalyticService.usersAnalyticCounts(dateRange),
      CustomerService.getTotalActiveCustomers(dateRange),
      CustomerService.getTotalActiveCustomers(epochDateRange),
    ]);

    const A = (activeUsersCount / lifeTimeActiveUsersCount) * 100;
    const churnRate = 100 - A;
    const {
      appSignUpCount,
      webSignUpCount,
      totalUsersCount,
      totalVerifiedUsersCount,
    } = usersAnalyticsSummary;

    // get total signup count within the period specified
    const totalSignedUp = appSignUpCount + webSignUpCount;

    // calculate sign up channel percentage
    const signUpChannelPercent = {
      ...(!totalSignedUp && { app: 0, web: 0 }), // if total sign up is 0
      ...(totalSignedUp && {
        app: (appSignUpCount * 100) / totalSignedUp,
        web: (webSignUpCount * 100) / totalSignedUp,
      }),
    };

    const data = {
      outstanding_balance: outstandingBalance,
      active_users_count: activeUsersCount,
      total_users: totalUsersCount,
      total_verified_Users_Count: totalVerifiedUsersCount,
      churn_rate: churnRate,
      sign_up_channel: {
        app: appSignUpCount,
        web: webSignUpCount,
      },
      sign_up_channel_percentage: {
        ...signUpChannelPercent,
      },
    };

    res.status(StatusCodes.OK).send({
      message: 'Analytics available',
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getTopTradersList = async (
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

    // GET TOP TRADERS
    const topTraders: TopTraders[] =
      await AnalyticService.fetchTopFiveTraders(dateRange);

    // find most traded products for each user
    const findMostTradedProducts =
      await AnalyticService.findTopTradedProducts(topTraders);

    // //delete the products array after getting most traded products

    const finalTopTraders = await AnalyticService.attachCustomerData(
      findMostTradedProducts,
    );

    res.status(200).send({
      message: 'final results available',
      data: { top_traders: finalTopTraders },
    });
  } catch (error) {
    next(error);
  }
};

/** Controller  to get total money in all customers wallet */
const getOrderSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    // validate the provided dates if available
    const dateRange = dateRangeValidator({
      ...(startDate && { startDate: startDate as string }),
      ...(endDate && { endDate: endDate as string }),
    });

    // get the order summary from the analytics service
    const usersAnalyticsSummary =
      await AnalyticService.ordersAnalytic(dateRange);

    const { successfulOrders, pendingOrders, declinedOrders } =
      usersAnalyticsSummary;

    // total sales
    const totalOrders = successfulOrders + declinedOrders + pendingOrders;

    const successfulOrdersPercentage = !totalOrders
      ? 0
      : (successfulOrders * 100) / totalOrders;

    res.status(StatusCodes.OK).send({
      message: 'order summary within the date range available',
      data: {
        total_successful_orders: successfulOrders,
        total_pending_orders: pendingOrders,
        total_declined_orders: declinedOrders,
        total_orders: successfulOrders + pendingOrders + declinedOrders,
        sales_conversion_percentage: {
          successful_orders: successfulOrdersPercentage,
          total_orders: 100 - successfulOrdersPercentage,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export { getUserAnalyticsSummary, getTopTradersList, getOrderSummary };
