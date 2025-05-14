import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { RETURNS_ROUTE_PREFIX } from '../../constants/route';
import axios from 'axios';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ShopsService } from '../shops/shops.service';
import { ReturnsService } from './returns.service';
import { PatchReturnItemsStatusDto } from './dto/patch-return-items-status.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { taskProductsStatuses, taskStatuses } from './constants';

@ApiTags('Возвраты')
@Controller(RETURNS_ROUTE_PREFIX)
export class ReturnsController {
  constructor(
    private readonly shopService: ShopsService,
    private readonly returnsService: ReturnsService,
  ) {}

  @ApiParam({ name: 'task_id', required: true })
  @Post('/ozon/task/:task_id/giveout-png')
  async getGiveoutPng(@Res() res, @Req() req, @Param() params) {
    const targetTask = await this.returnsService.getReturnTask(params.task_id);

    console.log(targetTask);

    if (!targetTask) {
      res.status(404).json({ data: { error: 'Задача не найдена' } });
      return;
    }

    const shopIds = targetTask?.products.map((product) => product.shop_id);
    const uniqueShopIds = Array.from(new Set(shopIds));
    const images = [];

    console.log(shopIds, uniqueShopIds);

    for (const shopId of uniqueShopIds) {
      const shop = await this.shopService.getShop(shopId);
      const { clientId, apiKey } = shop;

      try {
        const response = await axios.post(
          `${process.env.OZON_API_URL}/return/giveout/get-png`,
          {},
          {
            headers: {
              'Api-key': apiKey,
              'Client-id': clientId,
            },
          },
        );

        images.push(response.data);
      } catch (error) {
        res.status(error.status).json({ data: { error: error.response.data } });
      }
    }

    res.status(200).json({ data: images });
  }

  @ApiParam({ name: 'organization_id', required: true })
  @Post('/:organization_id/ozon/list')
  async getAllReturnsReceivedList(@Res() res, @Req() req, @Param() params) {
    const shops = await this.shopService.getShops(params.organization_id);
    const result = [];

    for (const shop of shops) {
      const { clientId, apiKey } = shop;

      const reqBody = {
        filter: {
          visual_status_name: process.env.OZON_RETURNS_FILTER_STATUS,
        },
        limit: 500,
      };

      try {
        const response = await axios.post(
          `${process.env.OZON_API_URL}/returns/list`,
          reqBody,
          {
            headers: {
              'Api-key': apiKey,
              'Client-id': clientId,
            },
          },
        );

        const returns = response.data?.returns;

        returns?.forEach((returnItem) => {
          const targetPlaceIndex = result.findIndex((place) => {
            return place?.warehouse?.id === returnItem?.target_place?.id;
          });

          if (targetPlaceIndex > -1) {
            if (result[targetPlaceIndex].warehouse?.products) {
              result[targetPlaceIndex].warehouse.products.push({
                return_id: returnItem.id,
                product_name: returnItem.product.name,
                product_sku: returnItem.product.sku,
                order_id: returnItem.order_id,
                company_id: returnItem.company_id,
                barcode: returnItem.logistic?.barcode,
                shop_id: shop.id,
              });
            } else {
              result[targetPlaceIndex].products = [];
            }
          } else {
            result.push({
              warehouse: {
                id: returnItem.target_place.id,
                name: returnItem.target_place.name,
                address: returnItem.target_place.address,
                products: [
                  {
                    return_id: returnItem.id,
                    product_name: returnItem.product.name,
                    product_sku: returnItem.product.sku,
                    order_id: returnItem.order_id,
                    company_id: returnItem.company_id,
                    barcode: returnItem.logistic?.barcode,
                    shop_id: shop.id,
                  },
                ],
              },
            });
          }
        });
      } catch (error) {
        res.status(error.status).json({ data: { error: error.response.data } });
      }
    }

    res.status(200).json({ data: result });
  }

  @ApiParam({ name: 'organization_id', required: true })
  @ApiParam({ name: 'warehouse_id', required: true })
  @Post('/:organization_id/ozon/warehouse/:warehouse_id/create-task')
  async createTaskReturnsReceivedList(@Res() res, @Req() req, @Param() params) {
    const currentTasks = await this.returnsService.getReturnsTasks(
      params.warehouse_id,
    );
    const activeTask = currentTasks.filter(
      (task) => task.status === taskStatuses.active,
    );

    if (activeTask?.length > 0) {
      res.status(201).json({ data: activeTask[0] });
      return;
    }

    const shops = await this.shopService.getShops(params.organization_id);

    let result = [];
    let taskName = '';

    for (const shop of shops) {
      const { clientId, apiKey } = shop;

      const reqBody = {
        filter: {
          visual_status_name: process.env.OZON_RETURNS_FILTER_STATUS,
          //warehouse_id: params.warehouse_id,
        },
        limit: 500,
      };

      try {
        const response = await axios.post(
          `${process.env.OZON_API_URL}/returns/list`,
          reqBody,
          {
            headers: {
              'Api-key': apiKey,
              'Client-id': clientId,
            },
          },
        );

        const returns = response.data?.returns;
        taskName = returns[0]?.target_place?.name || '';

        const returnsList = returns
          .filter((returnItem) => {
            return returnItem?.target_place?.id === Number(params.warehouse_id);
          })
          .map((returnItemResult) => {
            return {
              return_id: returnItemResult.id,
              product_name: returnItemResult.product.name,
              product_sku: returnItemResult.product.sku,
              order_id: returnItemResult.order_id,
              company_id: returnItemResult.company_id,
              barcode: returnItemResult.logistic?.barcode,
              status: taskProductsStatuses.active,
              shop_id: shop.id,
            };
          });

        if (returnsList?.length > 0) {
          result = [...result, ...returnsList];
        }
      } catch (error) {
        res.status(error.status).json({ data: { error: error.response.data } });
      }
    }

    if (result.length > 0) {
      const saved = await this.returnsService.createReturnTask({
        name: taskName,
        warehouse_id: params.warehouse_id,
        products: result,
        shop_id: params.shop_id,
      });
      res.status(201).json({ data: saved });
    } else {
      res.status(422).json({
        data: {
          error: 'Не найдены товары на возврат',
        },
      });
    }
  }

  @ApiParam({ name: 'warehouse_id', required: true })
  @Post('/ozon/warehouse/:warehouse_id/create-task-with-body')
  async createTaskReturnsReceivedListWithBody(
    @Res() res,
    @Req() req,
    @Param() params,
    @Body() body: CreateTaskDto,
  ) {
    const currentTasks = await this.returnsService.getReturnsTasks(
      params.warehouse_id,
    );
    const activeTask = currentTasks.filter(
      (task) => task.status === taskStatuses.active,
    );

    if (activeTask?.length > 0) {
      res.status(201).json({ data: activeTask[0] });
      return;
    }

    const products = body?.products;

    if (!Array.isArray(body?.products) || body?.products?.length === 0) {
      res.status(422).json({ data: { error: 'Не передан список товаров' } });

      return;
    }

    const productsResult = products.map((product) => {
      return {
        ...product,
        status: taskProductsStatuses.active,
      };
    });

    const saved = await this.returnsService.createReturnTask({
      name: body?.name || '',
      warehouse_id: params.warehouse_id,
      products: productsResult,
      status: taskStatuses.active,
    });

    res.status(201).json({ data: saved });
  }

  @ApiParam({ name: 'warehouse_id', required: true })
  @Get('/ozon/warehouse/:warehouse_id/tasks')
  async getReturnsTasks(@Res() res, @Req() req, @Param() params) {
    const tasks = await this.returnsService.getReturnsTasks(
      params.warehouse_id,
    );

    res.status(200).json({ data: tasks });
  }

  @ApiParam({ name: 'task_id', required: true })
  @Get('/ozon/task/:task_id')
  async getReturnsTask(@Res() res, @Req() req, @Param() params) {
    const tasks = await this.returnsService.getReturnTask(params.task_id);

    res.status(200).json({ data: tasks });
  }

  @ApiParam({ name: 'task_id', required: true })
  @Delete('/ozon/task/:task_id')
  async delteReturnsTask(@Res() res, @Req() req, @Param() params) {
    const tasks = await this.returnsService.deleteReturnTask(params.task_id);

    res.status(200).json({ data: tasks });
  }

  @ApiParam({ name: 'task_id', required: true })
  @Patch('/ozon/task/:task_id/update-status/active')
  async patchReturnTaskStatusActive(@Res() res, @Req() req, @Param() params) {
    const task = await this.returnsService.patchReturnTaskStatus(
      params.task_id,
      taskStatuses.active,
    );

    res.status(200).json({ data: task });
  }

  @ApiParam({ name: 'task_id', required: true })
  @Patch('/ozon/task/:task_id/update-status/pending')
  async patchReturnTaskStatusPending(@Res() res, @Req() req, @Param() params) {
    const task = await this.returnsService.patchReturnTaskStatus(
      params.task_id,
      taskStatuses.pending,
    );

    res.status(200).json({ data: task });
  }

  @ApiParam({ name: 'task_id', required: true })
  @Patch('/ozon/task/:task_id/update-status/completed')
  async patchReturnTaskStatus(@Res() res, @Req() req, @Param() params) {
    const task = await this.returnsService.patchReturnTaskStatus(
      params.task_id,
      taskStatuses.completed,
    );

    res.status(200).json({ data: task });
  }

  @ApiParam({ name: 'task_id', required: true })
  @Patch('/ozon/task/:task_id/update-items-status')
  async patchReturnTask(
    @Res() res,
    @Req() req,
    @Param() params,
    @Body() body: PatchReturnItemsStatusDto,
  ) {
    const task = await this.returnsService.patchReturnTaskItemStatuses(
      params.task_id,
      body.return_ids,
    );

    res.status(200).json({ data: task });
  }
}

// cat_phones	Магазин «ТФН-Cat Phones»	23545	d8dc2e3b-6eaf-48d7-b884-790590a86d34
// tfn_anker	Магазин «ТФН-ANKER»	310030	c030816a-6cfa-4602-8764-b82faad7be22
// tfn_mio	Магазин «ТФН-MIO»	432097	c4aed73d-39f0-4adf-a8b8-58bbfdc10e7a
// holding	Магазин «Мега-Ф Холдинг»	95458	d11c7502-c918-4331-838a-5f9d234cd7ac
// rs_e_com	Магазин «Ритейл Решения»	192037	8901a78c-ea81-4885-b60e-c2f9f7ea6b17
// philips_mobile	Магазин «Philips Mobile»	719000	4b3c2748-c77f-412f-94d3-80984a2564e3
// electrograd	Магазин «Электроград»	25773	3e26b386-78d5-4d32-a965-4bf5debcd209
// philips_headphones	Магазин «Philips Headphones»	1187106	c8d9224d-f49a-47b9-8224-ceedd1668a9b
// samsung_store	Магазин «Samsung Store»	1369340	f5030e1a-8ea6-4396-b6a5-92d9d9c89b3e
// tfn_itel	Магазин «Официальный магазин Itel»	1377650	05df1b50-3b74-4c3c-b769-54c733ffe13d
// tfn_allglasses	Магазин «ТФН AllGlasses»	2028340	804f00ca-f2df-4b41-86a3-48a11431336a
// tfn_tecno	Магазин «TECNO Premium Store»	2014473	34365299-cb86-4e7c-bdc1-1c7cafdefb27
// xenium	Магазин «Xenium Mobile»	2119612	164ea315-fe39-4d12-814a-8e5e03e68c9b
// tfn_kz	Магазин «ТФН-KZ»	1681781	94f2d273-9193-4570-ada4-dc5ab0c5cc83
// haier	Магазин «Haier Store»	2562720	77d48549-0956-4122-a232-e34e4ba33615
