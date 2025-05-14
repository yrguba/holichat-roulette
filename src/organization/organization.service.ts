import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import {
  Organization,
  OrganizationDocument,
} from './schemas/organization.schema';
import { Model } from 'mongoose';

import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    private configService: ConfigService,
  ) {}

  async createOrganization(
    organization: Organization,
  ): Promise<OrganizationDocument> {
    const createdOrganization = new this.organizationModel({
      ...organization,
    });
    return createdOrganization.save();
  }

  async createFromDto(
    userId: string,
    dto: CreateOrganizationDto,
  ): Promise<OrganizationDocument> {
    return this.createOrganization({
      name: dto.name,
      owner_id: userId,
    });
  }

  async updateOrganization(
    id: string,
    organization: CreateOrganizationDto,
  ): Promise<OrganizationDocument> {
    return this.organizationModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          ...organization,
        },
      },
      { returnDocument: 'after' },
    );
  }

  async getOrganization(id: string): Promise<OrganizationDocument> {
    return this.organizationModel.findById(id);
  }

  async getOrganizations(userId: string): Promise<OrganizationDocument[]> {
    return this.organizationModel.find({ owner_id: userId }).exec();
  }
}
