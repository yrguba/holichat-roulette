import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ReturnTask, ReturnTaskDocument } from './schemas/return-task.schema';
import { Model } from 'mongoose';
import { taskProductsStatuses } from './constants';

@Injectable()
export class ReturnsService {
  constructor(
    @InjectModel(ReturnTask.name)
    private returnTaskModel: Model<ReturnTaskDocument>,
    private configService: ConfigService,
  ) {}

  async createReturnTask(returnTask: ReturnTask): Promise<ReturnTaskDocument> {
    const createdReturnTask = new this.returnTaskModel({
      ...returnTask,
    });
    return createdReturnTask.save();
  }

  async getReturnTask(id: string): Promise<ReturnTaskDocument> {
    return this.returnTaskModel.findById(id);
  }

  async getReturnsTasks(warehouse_id: number): Promise<ReturnTaskDocument[]> {
    return this.returnTaskModel.find({ warehouse_id: warehouse_id }).exec();
  }

  async deleteReturnTask(id: string): Promise<ReturnTaskDocument> {
    return this.returnTaskModel.findByIdAndDelete(
      {
        _id: id,
      },
      { returnDocument: 'after' },
    );
  }

  async patchReturnTaskStatus(
    id: string,
    status: string,
  ): Promise<ReturnTaskDocument> {
    return this.returnTaskModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          status: status,
        },
      },
      { returnDocument: 'after' },
    );
  }

  async patchReturnTaskItemStatuses(
    id: string,
    ids: number[],
  ): Promise<ReturnTaskDocument> {
    const targetTask = await this.getReturnTask(id);
    const products = targetTask.products;

    const newProducts = products.map((product) => {
      return {
        ...product,
        status: ids.includes(product.return_id)
          ? taskProductsStatuses.completed
          : taskProductsStatuses.active,
      };
    });

    return this.returnTaskModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          products: [...newProducts],
        },
      },
      { returnDocument: 'after' },
    );
  }
}
