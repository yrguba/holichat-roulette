import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from '../../mongoose/base-model.schema';

export type OrganizationDocument = HydratedDocument<Organization>;

@Schema({
  timestamps: true,
})
export class Organization extends BaseModel<Organization> {
  @Prop({
    required: false,
  })
  name?: string;
  @Prop({
    required: false,
  })
  owner_id?: string;
  @Prop({
    required: false,
  })
  employee?: string[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
