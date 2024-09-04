import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BuyDto {
  @ApiProperty({
    description: 'ID of the affiliate',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  affiliateId: number;

  @ApiProperty({
    description: 'ID of the product or resource being associated',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  id: number;
}
