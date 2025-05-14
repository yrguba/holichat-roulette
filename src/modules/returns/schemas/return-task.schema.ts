import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Exclude } from 'class-transformer';
import { BaseModel } from '../../../mongoose/base-model.schema';
import dayjs from 'dayjs';

export type ReturnTaskDocument = HydratedDocument<ReturnTask>;

@Schema({
  timestamps: true,
})
export class ReturnTask extends BaseModel<ReturnTask> {
  @Prop({
    required: false,
  })
  name?: string;

  @Prop({
    required: true,
    default: dayjs().format(),
  })
  date?: string;

  @Prop({
    required: true,
    default: 'active',
  })
  status?: string;

  @Prop({
    required: true,
  })
  products?: Record<string, any>[];

  @Prop({
    required: true,
  })
  warehouse_id: number;

  @Prop({
    required: false,
  })
  shop_id?: string;
}

export const ReturnTaskSchema = SchemaFactory.createForClass(ReturnTask);
