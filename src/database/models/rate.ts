import mongoose, {
  type Document,
  type PaginateModel,
  Schema,
  model,
} from 'mongoose';
import paginate from 'mongoose-paginate-v2';

interface IRate extends Document {
  high: number;
  low: number;
  value: number;
  product_id: mongoose.Schema.Types.ObjectId;
  country_code: string;
  featured: boolean;
}

const rateSchema: Schema<IRate> = new Schema<IRate>(
  {
    high: {
      type: Number,
      required: true,
      min: 1,
    },
    low: {
      type: Number,
      required: true,
      min: 1,
    },
    value: {
      type: Number,
      required: true,
      min: 1,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'products',
    },
    country_code: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true },
);

rateSchema.plugin(paginate);

const Rate = model<IRate, PaginateModel<IRate>>('rates', rateSchema);

export { type IRate, Rate };
