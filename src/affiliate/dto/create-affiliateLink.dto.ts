import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAffiliateLinkDto {
  @ApiProperty({ description: 'ID of the affiliate', example: 1 })
  @IsInt()
  @IsPositive()
  affiliateId: number;

  @ApiProperty({ description: 'ID of the product', example: 1 })
  @IsInt()
  @IsPositive()
  productId: number;
}
