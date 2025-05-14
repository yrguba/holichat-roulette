import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserAvatarDto {
  @ApiProperty({
    description: 'User phone',
    example: '+79111111111',
  })
  avatar: string;
}
