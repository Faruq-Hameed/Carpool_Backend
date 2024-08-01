import { type Document, type PaginateModel, Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

interface IContent extends Document {
  name: string;
  value?: string;
  type?: string;
}

const contentSchema: Schema<IContent> = new Schema<IContent>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    value: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  { timestamps: true },
);

contentSchema.plugin(paginate);

const Content = model<IContent, PaginateModel<IContent>>(
  'contents',
  contentSchema,
);

export { type IContent, Content };
