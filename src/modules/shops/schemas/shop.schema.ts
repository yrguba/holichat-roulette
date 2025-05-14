import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Exclude } from 'class-transformer';
import { BaseModel } from '../../../mongoose/base-model.schema';

export type ShopDocument = HydratedDocument<Shop>;

@Schema({
  timestamps: true,
})
export class Shop extends BaseModel<Shop> {
  @Prop({
    required: false,
  })
  name?: string;

  @Prop({
    required: false,
  })
  organizationId?: string;

  @Exclude()
  @Prop({
    required: true,
  })
  clientId?: number;

  @Exclude()
  @Prop({
    required: true,
  })
  apiKey?: string;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
