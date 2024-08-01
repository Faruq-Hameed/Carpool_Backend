interface IFilterQuery {
  start_date: string;
  end_date: string;
  country_code: string;
  product: string;
  featured: string;
}

interface INewRate {
  high: number;
  low: number;
  value: number;
  product_id: string;
  country_code: string;
  featured: boolean;
}
export type { IFilterQuery, INewRate };
