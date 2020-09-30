import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  public title: string;
  @Prop({ required: true })
  public description: string;
  @Prop({ required: true })
  public price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
