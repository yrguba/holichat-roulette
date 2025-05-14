import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { BaseModel } from "../../mongoose/base-model.schema";

export type ConnectionDocument = HydratedDocument<Connection>;

@Schema({
  timestamps: true,
})
export class Connection extends BaseModel<Connection> {
  @Prop({
    required: true,
  })
  clientId: string;

  @Prop({
    required: true,
  })
  uuid: string;

  @Prop({
    required: true,
  })
  isWaiting: boolean;
}

export const ConnectionsSchema = SchemaFactory.createForClass(Connection);
