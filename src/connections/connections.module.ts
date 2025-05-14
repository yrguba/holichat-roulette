import { Module } from "@nestjs/common";
import { ConnectionsController } from "./connections.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ConnectionsService } from "./connections.service";
import { Connection, ConnectionsSchema } from "./schemas/connections.schema";
import { CryptoService } from "../crypto/crypto.service";
import { ConnectionsGateway } from "./connection.gateway";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Connection.name,
        schema: ConnectionsSchema,
      },
    ]),
  ],
  controllers: [ConnectionsController],
  providers: [ConnectionsService, CryptoService, ConnectionsGateway],
})
export class ConnectionsModule {}
