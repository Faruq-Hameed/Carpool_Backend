interface IFilterQuery {
  type: string;
  start_date: string;
  end_date: string;
  country_code: string;
  name: string;
}

interface INewProduct {
  name: string;
  country_code: string | null;
  image: string | null;
  background: string | null;
  type: string;
  code: string | null;
  wallet_address: string | null;
  qrcode: string | null;
}
export type { IFilterQuery, INewProduct };
