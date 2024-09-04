import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags } from '@nestjs/swagger';
import { BuyDto } from 'src/affiliate/dto/buy.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Post('buy/:id')
  async buyProduct(@Body() dto: BuyDto) {
    return await this.productService.buyProduct(dto);
  }

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductById(id);
  }
}
