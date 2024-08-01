import { type Model, type Document } from 'mongoose';

export const createPaginateOptions = (data): any => {
  const page = (data.page as string) ?? '1';
  const limit = (data.limit as string) ?? '10';
  const sortBy = (data.sort_by as string) ?? '';
  const order = data.order as 'asc' | 'desc'; // order can be ascending or descending, which defaults to ascending
  const sortOptions: Record<string, number> = {};
  if (sortBy !== '') {
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;
  }
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sortOptions,
  };
};

export const rangeFilter = (key, greaterThan, lesserThan): any => {
  if (
    (greaterThan !== null && greaterThan !== undefined) ||
    (lesserThan !== null && lesserThan !== undefined)
  )
    return {
      [key]: {
        ...(greaterThan !== null &&
          greaterThan !== undefined && { $gte: greaterThan }),
        ...(lesserThan !== null &&
          lesserThan !== undefined && { $lte: lesserThan }),
      },
    };
};

// Define the allowed types for the sort option
export type SortOption =
  | string
  | Record<string, 1 | -1 | { $meta: 'textScore' }>
  | Array<[string, 1 | -1]>
  | null
  | undefined;

// Interface for pagination options (all of them are optional)
export interface PaginateOptions {
  page?: number; // The current page number
  limit?: number;
  sort?: SortOption;
  select?: string | Record<string, 0 | 1 | boolean>; // Fields to include or exclude
  populate?: Array<{
    path: string;
    select?: string | Record<string, 0 | 1 | boolean>;
  }>; // Fields to populate with their props
}

// Interface for the paginated result
export interface PaginatedResult<T> {
  docs: T[]; // Array of documents
  totalDocs: number; // Total number of documents
  limit: number; // Number of documents per page
  page: number; // Current page number
  totalPages: number; // Total number of pages
}

/** Generic pagination function expecting model, query, limit and page as parameters */
export const paginate = async <T extends Document>(
  model: Model<T>, // model to query from
  query: Record<string, any>, // query parameters to filter
  options: PaginateOptions, // pagination options: sort, limit,page select
): Promise<PaginatedResult<T>> => {
  const { page = 1, limit = 10, sort = {}, select, populate = [] } = options;
  const skip = (page - 1) * limit;

  try {
    // Build the query with optional select fields
    let docsQuery = model.find(query).sort(sort).skip(skip).limit(limit);
    if (select) {
      // i.e if some fields were selected or not
      docsQuery = docsQuery.select(select);
    }
    // handle population of fields and its props
    if (Array.isArray(populate) && populate.length > 0) {
      populate.forEach(({ path, select }) => {
        docsQuery = docsQuery.populate({ path, select, strictPopulate: false });
      });
    }

    // run the query to fetch the data
    const docs = await docsQuery.exec();

    // Get the counts of documents that match the query
    const totalDocs = await model.countDocuments(query).exec();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalDocs / limit);

    // Return the paginated result
    return {
      docs,
      totalDocs,
      limit,
      page,
      totalPages,
    };
  } catch (error) {
    // Handle any errors that occur during the query
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

/** Date validator */
export const isValidDate = (date: string): boolean => {
  return !isNaN(Date.parse(date));
};
