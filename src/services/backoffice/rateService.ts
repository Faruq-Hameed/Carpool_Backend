import { type IRate, Rate } from '@/database/models/rate';
import { type INewRate } from '@/interfaces/backoffice/rateInterface';
import { BadRequestException, NotFoundException } from '@/exceptions';
import { paginate, type SortOption } from '@/utils/common';

class RateService {
  // check if rates exist
  async checkRateExists(
    data: any,
  ): Promise<{ exists: boolean; existingRate?: IRate }> {
    const filter = {
      high: data.high,
      product_id: data.product_id,
      country_code: data.country_code,
    };
    const existingRate = await Rate.findOne(filter, '_id');
    if (existingRate) {
      return { exists: true, existingRate };
    }
    return { exists: false };
  }

  async addNewRate(data: INewRate): Promise<IRate> {
    const { exists } = await this.checkRateExists(data);
    if (exists) {
      throw new BadRequestException('Rate already exists');
    }
    return await Rate.create(data);
  }

  async fetchOneRate(productId: string): Promise<IRate | null> {
    const rate = await Rate.findById(productId);
    if (!rate) {
      throw new NotFoundException('Rate does not exist');
    }
    return rate;
  }

  async fetchRatesByProduct(query: Record<string, any>): Promise<any> {
    // fetching the rate by the product id
    const { page = 1, limit = 10, productId, ...otherFields } = query;
    const sort: SortOption = { createdAt: -1 };
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort,
    };
    const DBquery = {
      ...otherFields,
      // filter by product id
      product_id: productId,
    }; // other fields used to filter
    return await paginate(Rate, DBquery, options);
  }

  // using pagination options for the fetch
  async fetchAllRates(query: Record<string, any>): Promise<any> {
    const {
      page = 1,
      limit = 10,
      featured,
      product,
      countryCode,
      ...otherFields
    } = query;
    const sort: SortOption = { createdAt: -1 };
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort,
    };
    const DBquery: Record<string, any> = {
      // filtering by the other fields
      ...otherFields,
      ...(featured && { featured: { $regex: featured } }),
      ...(product && { product_id: { $regex: product } }),
      ...(countryCode && {
        country_code: { $regex: new RegExp(`^${countryCode}$`, 'i') },
      }), // Case-insensitive regex match for country code
    };
    return await paginate(Rate, DBquery, options);
  }

  async updateRate(rateId: string, data: INewRate): Promise<IRate | null> {
    const rate = await this.fetchOneRate(rateId);
    if (!rate) {
      throw new NotFoundException('Rate does not exist');
    }
    return await Rate.findByIdAndUpdate(rateId, data, { new: true });
  }

  async deleteRate(rateId: string): Promise<IRate | null> {
    // check if rate exists
    const rate = await this.fetchOneRate(rateId);
    if (!rate) {
      throw new NotFoundException('Rate does not exist');
    }
    return await Rate.findByIdAndDelete(rateId);
  }
}

export default new RateService();
