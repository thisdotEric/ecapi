export interface IProduct {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export interface ICreatedProduct extends IProduct {
  product_id: string;
}
