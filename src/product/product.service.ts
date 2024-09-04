import { BadRequestException, Injectable } from '@nestjs/common';
import { BuyDto } from 'src/affiliate/dto/buy.dto';
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

  async buyProduct(dto: BuyDto) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: dto.id,
      },
    });

    if (!product.id) {
      throw new BadRequestException('Product not found');
    }

    const affiliate = await this.prisma.affiliate.findFirst({
      where: {
        id: dto.affiliateId,
      },
    });

    if (!affiliate.id) {
      throw new BadRequestException('Affiliate not found');
    }

    const affiliateLink = await this.prisma.affiliateLink.findFirst({
      where: {
        affiliateId: affiliate.id,
      },
    });

    if (!affiliateLink.id) {
      throw new BadRequestException('Invalid affiliate link');
    }

    const { sales, clicks } = affiliateLink;

    await this.prisma.affiliateLink.update({
      where: {
        id: affiliateLink.id,
      },
      data: {
        sales: {
          increment: 1,
        },
        totalRevenue: {
          increment: product.price,
        },
        commissionEarned: {
          increment:
            ((affiliateLink.totalRevenue + product.price) *
              affiliate.commission) /
            100,
        },
        conversionRate: (sales / clicks) * 100,
      },
    });
  }
}
