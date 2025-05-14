import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Shop, ShopDocument } from './schemas/shop.schema';
import { Model } from 'mongoose';

import { CreateShopDto } from './dto/create-shop.dto';

@Injectable()
export class ShopsService {
  constructor(
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    private configService: ConfigService,
  ) {}

  async createShop(shop: Shop): Promise<ShopDocument> {
    //return new this.shopModel.create(shop);

    const createdShop = new this.shopModel({
      ...shop,
    });
    return createdShop.save();
  }

  async createFromDto(
    organization_id: string,
    dto: CreateShopDto,
  ): Promise<ShopDocument> {
    return this.createShop({
      organizationId: organization_id,
      name: dto.name,
      clientId: dto.clientId,
      apiKey: dto.apiKey,
    });
  }

  async updateShop(id: string, shop: CreateShopDto): Promise<ShopDocument> {
    return this.shopModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          ...shop,
        },
      },
      { returnDocument: 'after' },
    );
  }

  async getShop(id: string): Promise<ShopDocument> {
    return this.shopModel.findById(id);
  }

  async getShops(organization_id): Promise<ShopDocument[]> {
    return this.shopModel
      .find({ organizationId: organization_id })
      .sort({ updatedAt: -1 })
      .exec();
  }

  async deleteShop(id: string): Promise<ShopDocument> {
    return this.shopModel.findByIdAndDelete(
      {
        _id: id,
      },
      { returnDocument: 'after' },
    );
  }
}
