import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RETURNS_ROUTE_PREFIX } from '../../constants/route';
import { ShopsService } from './shops.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateShopDto } from './dto/create-shop.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Магазины')
@Controller(RETURNS_ROUTE_PREFIX)
export class ShopsController {
  constructor(private readonly shopService: ShopsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'organization_id', required: true })
  @Get(':organization_id/ozon/shops')
  async getShops(@Res() res, @Req() req, @Param() params) {
    const shops = await this.shopService.getShops(params.organization_id);

    res.status(200).json({ data: shops });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'organization_id', required: true })
  @Post('/:organization_id/ozon/shops')
  async createShop(
    @Res() res,
    @Req() req,
    @Body() body: CreateShopDto,
    @Param() params,
  ) {
    const shops = await this.shopService.createFromDto(
      params.organization_id,
      body,
    );

    res.status(200).json({ data: shops });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: '_id', required: true })
  @Put('/shop/:_id')
  async updateShop(
    @Res() res,
    @Req() req,
    @Body() body: CreateShopDto,
    @Param() params,
  ) {
    const shops = await this.shopService.updateShop(params._id, body);

    res.status(200).json({ data: shops });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: '_id', required: true })
  @Delete('/shop/:_id')
  async deleteShop(@Res() res, @Req() req, @Param() params) {
    const shops = await this.shopService.deleteShop(params._id);

    res.status(200).json({ data: shops });
  }
}
