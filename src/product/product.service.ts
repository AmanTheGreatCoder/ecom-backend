import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts() {
    return await this.prisma.product.findMany();
  }

  async getProductById(id: number) {
    const prod = await this.prisma.product.findFirst({
      where: {
        id: id,
      },
    });

    if (!prod || !prod.id) {
      throw new BadRequestException('Product not found');
    }

    return prod;
  }
}
