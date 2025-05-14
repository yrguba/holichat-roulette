import { ApiProperty } from '@nestjs/swagger';

export class CreateConnectionDto {
  @ApiProperty({
    description: 'uuid соединения',
  })
  uuid: string;
}
