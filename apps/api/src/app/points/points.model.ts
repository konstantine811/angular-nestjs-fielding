import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Point extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  public latitude: number;
  @Prop({ required: true })
  public longitude: number;
  @Prop({ required: true })
  public x: number;
  @Prop({ required: true })
  public y: number;
  @Prop({ required: true })
  public z: number;
}

export const PointSchema = SchemaFactory.createForClass(Point);
