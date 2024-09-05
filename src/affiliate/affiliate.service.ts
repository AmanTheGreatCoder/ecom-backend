import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAffiliateLinkDto } from './dto/create-affiliate-link.dto';

@Injectable()
export class AffiliateService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetVisitsToday() {
    await this.prisma.affiliate.updateMany({
      data: {
        visits_today: 0,
      },
    });
  }

  async createAffiliateLink(dto: CreateAffiliateLinkDto) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: dto.productId,
      },
    });

    if (!product?.id) {
      throw new BadRequestException('Product not found');
    }

    const affiliate = await this.prisma.affiliate.findFirst({
      where: {
        id: dto.affiliateId,
      },
    });

    if (!affiliate?.id) {
      throw new BadRequestException('Affiliate not found');
    }

    const affiliateLink = await this.prisma.affiliateLink.findFirst({
      where: {
        productId: dto.productId,
        affiliateId: dto.affiliateId,
      },
    });

    console.log('affiliate Linkkkk', affiliateLink);

    if (affiliateLink?.id) {
      throw new BadRequestException('Affiliate Link already exists');
    }

    return await this.prisma.affiliateLink.create({
      data: {
        affiliateId: dto.affiliateId,
        productId: dto.productId,
        link: `http://localhost:3000/products/${dto.productId}?code=${dto.affiliateId}`,
      },
    });
  }

  async registerClick(id: number) {
    const affiliateData = await this.prisma.affiliate.findFirst({
      where: {
        id: id,
      },
      include: {
        affiliateLinks: true,
      },
    });

    if (!affiliateData?.id) {
      throw new BadRequestException('Affiliate not found');
    }

    const affiliateLink = await this.prisma.affiliateLink.findFirst({
      where: {
        affiliateId: id,
      },
    });

    if (!affiliateLink?.id) {
      throw new BadRequestException('Invalid affiliate link');
    }

    const totalConversionRate = affiliateData.affiliateLinks.reduce(
      (acc, link) => acc + link.conversionRate,
      0,
    );

    const { sales, clicks } = affiliateLink;

    const conversionRate =
      affiliateData.affiliateLinks.length > 0
        ? parseFloat(
            (totalConversionRate / affiliateData.affiliateLinks.length).toFixed(
              2,
            ),
          )
        : 0.0;

    await this.prisma.affiliateLink.update({
      where: {
        id: affiliateLink.id,
      },
      data: {
        clicks: {
          increment: 1,
        },
        conversionRate: (sales / (clicks + 1)) * 100,
      },
    });

    await this.prisma.affiliate.update({
      where: {
        id: id,
      },
      data: {
        visits: {
          increment: 1,
        },
        visits_today: {
          increment: 1,
        },
        conversion_rate: conversionRate,
      },
    });
  }

  async getAllAffiliateLinksData(affiliateId: number) {
    const affiliateData = await this.prisma.affiliate.findFirst({
      where: {
        id: affiliateId,
      },
      include: {
        affiliateLinks: true,
      },
    });

    if (!affiliateData?.id) {
      throw new BadRequestException('Affiliate not found');
    }

    return affiliateData;
  }
}
