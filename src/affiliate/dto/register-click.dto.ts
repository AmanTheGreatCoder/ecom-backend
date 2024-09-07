import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterClickDto {
  @ApiProperty({
    description: 'The ID of the affiliate creating the link',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  affiliateId?: number;

  @ApiProperty({
    description: 'The ID of the product being linked',
    example: 101,
  })
  @IsInt()
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: number;
}
