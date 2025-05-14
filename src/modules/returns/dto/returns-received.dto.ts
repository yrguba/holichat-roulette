import { ApiProperty } from '@nestjs/swagger';

export class ReturnsReceivedDto {
  @ApiProperty({
    description: 'Дата с',
    example: '2025-01-25T14:15:22Z',
  })
  dateFrom: string;

  @ApiProperty({
    description: 'Дата по',
    example: '2025-01-31T14:15:22Z',
  })
  dateTo: string;

  @ApiProperty({
    description:
      'Флаг отвечает за фильтрацию возвратов (полученных / НЕ полученных)',
    example: false,
  })
  is_received: boolean;

  @ApiProperty({
    description:
      'Идентификатор последнего значения на странице. Оставьте это поле пустым при выполнении первого запроса.',
    example: 0,
  })
  last_id: number;

  @ApiProperty({
    description: 'Количество значений в ответе',
    example: 500,
  })
  limit: number;
}
