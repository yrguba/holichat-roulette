import { Controller, Param, Post, Req, Res } from '@nestjs/common';
import { WAREHOUSE_ROUTE_PREFIX } from '../../constants/route';
import axios from 'axios';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ShopsService } from '../shops/shops.service';
import { response } from 'express';

@ApiTags('Список складов')
@Controller(WAREHOUSE_ROUTE_PREFIX)
export class WarehouseController {
  constructor(private readonly shopService: ShopsService) {}

  @ApiParam({ name: 'shop_id', required: true })
  @Post('/ozon/shops/:shop_id/warehouses')
  async getWarehouseList(@Res() res, @Req() req, @Param() params) {
    const shop = await this.shopService.getShop(params.shop_id);

    const { clientId, apiKey } = shop;

    try {
      const response = await axios.post(
        `${process.env.OZON_API_URL}/warehouse/list`,
        {},
        {
          headers: {
            'Api-key': apiKey,
            'Client-id': clientId,
          },
        },
      );

      let warehouseList = [];

      if (response?.data && response?.data?.result) {
        warehouseList = response?.data.result.map((warehouse) => {
          return { warehouse_id: warehouse.warehouse_id, name: warehouse.name };
        });
      }

      //res.status(response.status).json({ data: warehouseList });
      res.status(response.status).json({ data: response?.data.result });
    } catch (error) {
      res.status(error.status).json({ data: { error: error.response.data } });
    }
  }
}
