import { ApiProperty } from '@nestjs/swagger';

export class ReturnsReceivedListDto {
  @ApiProperty({
    description: 'Количество значений в ответе',
    example: 500,
  })
  limit: number;
}
