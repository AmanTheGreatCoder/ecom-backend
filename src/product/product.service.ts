import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts() {
    return await this.prisma.product.findMany({
      include: {
        affiliateLink: {
          where: {
            affiliateId: 2,
          },
        },
      },
    });
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

  async buyProduct(productId: number) {
    const affiliateId = 2;
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!product.id) {
      throw new BadRequestException('Product not found');
    }

    const affiliateData = await this.prisma.affiliate.findFirst({
      where: {
        id: affiliateId,
      },
      include: {
        affiliateLinks: true,
      },
    });

    if (!affiliateData.id) {
      throw new BadRequestException('Affiliate not found');
    }

    const affiliateLink = await this.prisma.affiliateLink.findFirst({
      where: {
        affiliateId: affiliateData.id,
        productId: productId,
      },
    });

    if (!affiliateLink?.id) {
      throw new BadRequestException('Invalid affiliate link');
    }

    const { sales, clicks } = affiliateLink;

    console.log('saless', sales, 'cliks', clicks);

    const comissionEarned = (product.price * affiliateData.commission) / 100;

    console.log('comission earned', comissionEarned);

    await this.prisma.affiliateLink.update({
      where: {
        id: affiliateLink.id,
        productId: productId,
      },
      data: {
        sales: {
          increment: 1,
        },
        totalRevenue: {
          increment: product.price,
        },
        commissionEarned: {
          increment: comissionEarned,
        },
        conversionRate: (sales / clicks) * 100,
      },
    });

    const totalConversionRate = affiliateData.affiliateLinks.reduce(
      (acc, link) => acc + link.conversionRate,
      0,
    );

    const conversionRate =
      affiliateData.affiliateLinks.length > 0
        ? parseFloat(
            (totalConversionRate / affiliateData.affiliateLinks.length).toFixed(
              2,
            ),
          )
        : 0.0;

    await this.prisma.affiliate.update({
      where: {
        id: affiliateData.id,
      },
      data: {
        conversion_rate: conversionRate,
        total_sales: {
          increment: product.price,
        },
        totalEarnings: {
          increment: comissionEarned,
        },
      },
    });
  }
}
