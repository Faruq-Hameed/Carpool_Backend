import { type INewProduct } from '@/interfaces/backoffice/productInterface';
import { type IProduct, Product } from '@/database/models';
import { BadRequestException, NotFoundException } from '@/exceptions';
import { paginate, type SortOption } from '@/utils/common';

class ProductService {
  // checking if product exists
  async checkProductExists(
    data: any,
  ): Promise<{ exists: boolean; existingProduct?: IProduct }> {
    const { name } = data;
    const existingProduct = await Product.findOne({ name }, '_id');
    if (existingProduct) {
      return { exists: true, existingProduct };
    }
    return { exists: false };
  }

  async addNewProduct(data: INewProduct): Promise<IProduct> {
    const { exists } = await this.checkProductExists(data);
    if (exists) {
      throw new BadRequestException('Product already exists');
    }
    return await Product.create(data);
  }

  async fetchOneProduct(productId: string): Promise<IProduct | null> {
    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundException('Product does not exist');
    }
    return product;
  }

  // using pagination options for the fetch
  async fetchAllProducts(query: Record<string, any>): Promise<any> {
    const {
      page = 1,
      limit = 10,
      name,
      type,
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
      // other fields used to filter
      ...otherFields,
      ...(name && { name: { $regex: name, $options: 'i' } }), // Case-insensitive regex match for name
      ...(type && { type }), // Directly add type if provided
      ...(countryCode && {
        // filter by country code if provided
        country_code: { $regex: new RegExp(`^${countryCode}$`, 'i') },
      }), // Case-insensitive regex match for country code
    };
    return await paginate(Product, DBquery, options);
  }

  async updateProduct(
    productId: string,
    data: INewProduct,
  ): Promise<IProduct | null> {
    // check if product exists
    const product = await this.fetchOneProduct(productId);
    if (!product) {
      throw new NotFoundException('Product does not exist');
    }
    // update product
    return await Product.findByIdAndUpdate(productId, data, { new: true });
  }

  async deleteProduct(productId: string): Promise<IProduct | null> {
    // check if product exists
    const product = await this.fetchOneProduct(productId);
    if (!product) {
      throw new NotFoundException('Product does not exist');
    }
    return await Product.findByIdAndDelete(productId);
  }
}

export default new ProductService();
