import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { Connection, ConnectionDocument } from "./schemas/connections.schema";
import { Model } from "mongoose";

import { CreateConnectionDto } from "./dto/create-connection.dto";
import { CryptoService } from "../crypto/crypto.service";
import { Server } from "socket.io";

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

  async refreshConnection(
    uuid: string,
    isWaiting: boolean
  ): Promise<ConnectionDocument> {
    return this.connectionModel.findOneAndUpdate(
      {
        uuid: uuid,
      },
      {
        $set: {
          uuid: uuid,
          isWaiting: isWaiting,
        },
      },
      { returnDocument: "after" }
    );
  }

  async getList(): Promise<ConnectionDocument[]> {
    return this.connectionModel.find({ isWaiting: true }).exec();
  }

  async getConnection(uuid: string): Promise<ConnectionDocument> {
    return this.connectionModel.findOne({ uuid: uuid });
  }

  async deleteConnection(clientId: string): Promise<ConnectionDocument> {
    return this.connectionModel.findOneAndDelete(
      {
        clientId: clientId,
      },
      { returnDocument: "after" }
    );
  }

  async deleteActiveConnections() {
    await this.connectionModel.deleteMany({ isWaiting: true }).exec();
  }
}
