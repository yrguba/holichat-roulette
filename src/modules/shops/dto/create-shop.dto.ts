import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShopDto {
  @ApiProperty({
    description: 'Название магазина',
    example: '',
  })
  name: string;

  @ApiProperty({
    description: 'ClientId',
    example: '1234',
  })
  @IsNotEmpty()
  clientId: number;

  @ApiProperty({
    description: 'ApiKey',
    example: '',
  })
  @IsNotEmpty()
  apiKey: string;
}
