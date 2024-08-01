// import { NotFoundException } from '@/exceptions';
import { User as Customer, Order } from '@/database/models';
import {
  type TopTraders,
  type TradersWithMostTradedProduct,
  type TradersWithData,
} from '@/utils/types';

class AnalyticsService {
  /** Get total users counts within the period */
  async usersAnalyticCounts(query: {
    startDate: Date;
    endDate: Date;
  }): Promise<Record<string, any>> {
    const { startDate, endDate } = query;

    /** total users as at the end date */
    const totalVerifiedUsersCount = await Customer.countDocuments({
      createdAt: { $lte: endDate },
      isEmailVerified: true,
      isPhoneVerified: true,
    });

    /** Total users on the platform as at the end date */
    const totalUsersCount = await Customer.countDocuments({
      createdAt: { $lte: endDate },
    });

    /** Get counts of users that sign up through the APP */
    const appSignUpCount = await Customer.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      channel: 'APP',
    });

    /** Get counts of users that signed up using web */
    const webSignUpCount = await Customer.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      channel: 'WEB',
    });

    return {
      appSignUpCount,
      webSignUpCount,
      totalUsersCount,
      totalVerifiedUsersCount,
    };
  }

  /** Get orders analytics */
  async ordersAnalytic(query: Record<string, any>): Promise<any> {
    const { startDate, endDate } = query;

    /** Total successful  orders within the time frame */
    const successfulOrders = await Order.countDocuments({
      createdAt: { $gt: startDate, $lt: endDate },
      status: 'success',
    });

    /** Total declined orders */
    const declinedOrders = await Order.countDocuments({
      createdAt: { $gt: startDate, $lt: endDate },
      status: 'declined',
    });

    /** Total pending orders */
    const pendingOrders = await Order.countDocuments({
      createdAt: { $gt: startDate, $lt: endDate },
      status: 'pending',
    });

    return {
      successfulOrders,
      pendingOrders,
      declinedOrders,
    };
  }

  // get 5 top traders within the time range
  async fetchTopFiveTraders(query: {
    startDate: Date;
    endDate: Date;
  }): Promise<TopTraders[]> {
    const { startDate, endDate } = query;

    const result = await Order.aggregate([
      {
        // Filters for orders with the status 'success' and within the specified date range
        $match: {
          status: 'success',
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      // Groups orders by the user field collects all traded products.
      {
        $group: {
          _id: '$user',
          tradingVolume: { $sum: '$return_in_usd' }, // calculates the total trading volume
          products: { $push: '$product_name' }, // collects all traded products for each user
        },
      },

      // Sorting the users by the total trading volume in descending order.
      {
        $sort: { tradingVolume: -1 },
      },
      {
        $limit: 5, // limiting the data to the top 5
      },
    ]);

    return result;
  }

  async findTopTradedProducts(
    topTraders: TopTraders[],
  ): Promise<TradersWithMostTradedProduct[]> {
    return topTraders.map(trader => {
      const productCount: Record<string, number> = {};

      // Count occurrences of each product
      for (const product of trader.products) {
        if (!productCount[product]) {
          productCount[product] = 1;
        } else {
          productCount[product]++;
        }
      }

      // Find the product with the highest count
      let mostTradedProduct = '';
      let maxCount = 0;
      for (const product in productCount) {
        if (productCount[product] > maxCount) {
          mostTradedProduct = product;
          maxCount = productCount[product];
        }
      }

      // Return a new object with the most traded product added

      return {
        userId: trader.userId,
        tradingVolume: trader.tradingVolume,
        mostTradedProduct,
      };
    });
  }

  async attachCustomerData(
    topTraders: TradersWithMostTradedProduct[],
  ): Promise<TradersWithData[]> {
    // Map over topTraders and create an array of promises
    // Iterate over each result item and fetch user name and email
    const promises = topTraders.map(async traderDoc => {
      const user = await Customer.findById(traderDoc.userId, {
        firstname: 1,
        lastname: 1,
        email: 1,
      });
      const fullName = user ? `${user.firstname} ${user.lastname}` : 'Unknown';
      const email = user ? user.email : 'Unknown email';

      return {
        userId: traderDoc.userId,
        fullName,
        email,
        tradingVolume: traderDoc.tradingVolume,
        mostTradedProduct: traderDoc.mostTradedProduct,
      };
    });

    // Await the resolution of all promises
    const updatedResult = await Promise.all(promises);
    return updatedResult;
  }
}

export default new AnalyticsService();
