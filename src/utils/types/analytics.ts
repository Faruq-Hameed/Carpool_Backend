export interface TopTraders {
  userId: any;
  tradingVolume: number;
  products: string[];
}
export interface TradersWithMostTradedProduct {
  userId: any;
  tradingVolume: number;
  mostTradedProduct: string;
}

export interface TradersWithData extends TradersWithMostTradedProduct {
  fullName: string;
  email: string;
}
