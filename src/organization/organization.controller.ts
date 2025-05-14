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
import { ORGANIZATION_ROUTE_PREFIX } from '../constants/route';
import { OrganizationService } from './organization.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { UserDocument } from '../user/schemas/user.schema';

@ApiTags('Организации')
@Controller(ORGANIZATION_ROUTE_PREFIX)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/list')
  async getOrganizations(@Res() res, @Req() req, @User() user: UserDocument) {
    const organizations = await this.organizationService.getOrganizations(
      user.id,
    );

    res.status(200).json({ data: organizations });
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/get/:id')
  async getOrganization(@Res() res, @Req() req, @Param() params) {
    const organization = await this.organizationService.getOrganization(
      params.id,
    );

    res.status(200).json({ data: organization });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createOrganization(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrganizationDto,
    @User() user: UserDocument,
  ) {
    const organization = await this.organizationService.createFromDto(
      user._id,
      body,
    );
    res.status(200).json({ data: organization });
  }

  @ApiParam({ name: '_id', required: true })
  @Put('/organization/:_id')
  async updateOrganization(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrganizationDto,
    @Param() params,
  ) {
    const organization = await this.organizationService.updateOrganization(
      params._id,
      body,
    );

    res.status(200).json({ data: organization });
  }
}
