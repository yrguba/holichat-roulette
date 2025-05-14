import { Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { ShopsService } from '../shops/shops.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from '../shops/schemas/shop.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Shop.name,
        schema: ShopSchema,
      },
    ]),
  ],
  controllers: [WarehouseController],
  providers: [ShopsService],
})
export class WarehouseModule {}
