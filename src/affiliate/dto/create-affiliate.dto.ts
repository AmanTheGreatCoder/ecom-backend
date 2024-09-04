import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAffiliateDto {
  @ApiProperty({ description: 'Name of the affiliate', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email of the affiliate',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
