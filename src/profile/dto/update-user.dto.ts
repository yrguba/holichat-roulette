import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'Василий',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Пупкин',
  })
  lastName: string;
  @ApiProperty({
    description: 'User birth day',
    example: '25.01.1995',
  })
  birthDay: string;

  @ApiProperty({
    description: 'User avatar link',
    nullable: true,
  })
  avatar: string;
}
