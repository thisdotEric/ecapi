import { prop, Severity } from '@typegoose/typegoose';

export interface IProduct {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export interface ICreatedProduct extends IProduct {
  product_id: string;
}

export class Product implements IProduct {
  @prop()
  name: string;

  @prop()
  description: string;

  @prop()
  price: number;

  @prop({ allowMixed: Severity.ALLOW })
  tags: string[];

  @prop()
  user_id: string;
}
