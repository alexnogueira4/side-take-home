export interface IProperty {
  id?: number;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  type?: string | null;
}

export interface IParams {
  page?: number;
  limit?: number;
  bedrooms?: number;
  bathrooms?: number;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  orderBy?: string;
  order?: "ASC" | "DESC",
  search?: string
};

export interface IProperties {
  data: IProperty[];
  page: number,
  limit: number,
  total: number,
  totalPages: number
}

export interface IMessage {
  status: string,
  message: string,
  data?: Object | IProperty | Array<IProperty>
}