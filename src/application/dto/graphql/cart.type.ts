import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class CartItemType {
  @Field()
  sku: string;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  quantity: number;

  @Field({ nullable: true })
  image?: string;

  @Field(() => Float)
  subtotal: number;
}

@ObjectType()
export class CartType {
  @Field(() => ID)
  userId: string;

  @Field(() => [CartItemType])
  items: CartItemType[];

  @Field(() => Float)
  subtotal: number;

  @Field(() => Float)
  tax: number;

  @Field(() => Float)
  total: number;

  @Field(() => Int)
  itemCount: number;

  @Field()
  currency: string;

  @Field()
  updatedAt: string;
}
