import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Post('buy/:id')
  async buyProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.buyProduct(id);
  }

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductById(id);
  }
}
