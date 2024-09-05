import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { BuyDto } from './dto/buy,dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts(@Query('affiliateId') affiliateId?: string) {
    const parsedAffiliateId = affiliateId
      ? parseInt(affiliateId, 10)
      : undefined;
    return this.productService.getAllProducts(parsedAffiliateId);
  }

  @Post('buy')
  async buyProduct(@Body() dto: BuyDto) {
    return await this.productService.buyProduct(dto);
  }

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductById(id);
  }
}
