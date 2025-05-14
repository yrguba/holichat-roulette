import { ApiProperty } from '@nestjs/swagger';

export class PatchReturnItemsStatusDto {
  @ApiProperty({
    description: 'Статус (active, pending, completed)',
    example: [54533, 34353],
  })
  return_ids: number[];
}
