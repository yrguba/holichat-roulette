import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Название задания(название склада)',
    example: 'СЦ Кавказский',
  })
  name: string;
  @ApiProperty({
    description: 'Список товаров',
    example: [],
  })
  products: Record<string, any>[];
}
