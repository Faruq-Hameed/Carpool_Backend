import { type Document, Schema, model, type PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { ProductType } from '@/utils/types/';

interface IProduct extends Document {
  name: string;
  country_code?: string;
  image?: string;
  background?: string;
  type: ProductType;
  code?: string;
  wallet_address?: string;
  qrcode?: string;
}

const productSchema: Schema<IProduct> = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    country_code: {
      type: String,
    },
    image: {
      type: String,
    },
    background: {
      type: String,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(ProductType),
    },
    code: {
      type: String,
      uppercase: true,
    },
    wallet_address: {
      type: String,
    },
    qrcode: {
      type: String,
    },
  },
  { timestamps: true },
);

productSchema.plugin(paginate);

const Product = model<IProduct, PaginateModel<IProduct>>(
  'products',
  productSchema,
);

export { type IProduct, Product };
