import { Module } from '@nestjs/common';
import { ReturnsController } from './returns.controller';
import { ShopsService } from '../shops/shops.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from '../shops/schemas/shop.schema';
import { ReturnsService } from './returns.service';
import { ReturnTask, ReturnTaskSchema } from './schemas/return-task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Shop.name,
        schema: ShopSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: ReturnTask.name,
        schema: ReturnTaskSchema,
      },
    ]),
  ],
  controllers: [ReturnsController],
  providers: [ShopsService, ReturnsService],
})
export class ReturnsModule {}
