import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { Connection, ConnectionDocument } from "./schemas/connections.schema";
import { Model } from "mongoose";

import { CreateConnectionDto } from "./dto/create-connection.dto";
import { CryptoService } from "../crypto/crypto.service";
import { Server } from "socket.io";
import { ShopDocument } from "../modules/shops/schemas/shop.schema";

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectModel(Connection.name)
    private connectionModel: Model<ConnectionDocument>,
    private configService: ConfigService,
    private readonly cryptoService: CryptoService
  ) {}

  public socket: Server = null;

  private static generatePassword(
    length = 20,
    characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$"
  ) {
    let randomstring = "";
    for (let i = 0; i < length; i++) {
      const rnum = Math.floor(Math.random() * characters.length);
      randomstring += characters.substring(rnum, rnum + 1);
    }

    return randomstring;
  }

  async createConnection(
    clientId: string,
    uuid: string
  ): Promise<ConnectionDocument> {
    const createdConnection = new this.connectionModel({
      clientId: clientId,
      uuid: uuid,
      isWaiting: true,
    });
    return createdConnection.save();
  }

  async refreshConnection(uuid: string): Promise<ConnectionDocument> {
    return this.connectionModel.findOneAndUpdate(
      {
        uuid: uuid,
      },
      {
        $set: {
          uuid: uuid,
          isWaiting: true,
        },
      },
      { returnDocument: "after" }
    );
  }

  async getList(): Promise<ConnectionDocument[]> {
    return this.connectionModel.find({ isWaiting: true }).exec();
  }

  async deleteConnection(clientId: string): Promise<ConnectionDocument> {
    return this.connectionModel.findByIdAndDelete(
      {
        clientId: clientId,
      },
      { returnDocument: "after" }
    );
  }
}
