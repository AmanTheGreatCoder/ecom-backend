import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAffiliateLinkDto } from './dto/create-affiliate-link.dto';
import { RegisterClickDto } from './dto/register-click.dto';

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

  async registerClick(dto: RegisterClickDto) {
    const affiliateData = await this.prisma.affiliate.findFirst({
      where: {
        id: dto.affiliateId,
      },
    });

    if (!affiliateData?.id) {
      throw new BadRequestException('Affiliate not found');
    }

    const affiliateLink = await this.prisma.affiliateLink.findFirst({
      where: {
        AND: [{ affiliateId: dto.affiliateId }, { productId: dto.productId }],
      },
    });

    if (!affiliateLink?.id) {
      throw new BadRequestException('Invalid affiliate link');
    }

    const { sales, clicks } = affiliateLink;

    await this.prisma.affiliateLink.update({
      where: {
        id: affiliateLink.id,
        productId: dto.productId,
      },
      data: {
        clicks: {
          increment: 1,
        },
        conversionRate: (sales / (clicks + 1)) * 100,
      },
    });
    const affiliateLinks = await this.prisma.affiliateLink.findMany({
      where: {
        AND: [{ affiliateId: dto.affiliateId }, { productId: dto.productId }],
      },
    });

    if (affiliateLinks.length <= 0) {
      throw new BadRequestException('Affiliate link not found');
    }

    const totalConversionRate = affiliateLinks.reduce(
      (acc, link) => acc + link.conversionRate,
      0,
    );

    const conversionRate =
      affiliateLinks.length > 0
        ? parseFloat((totalConversionRate / affiliateLinks.length).toFixed(2))
        : 0.0;

    await this.prisma.affiliate.update({
      where: {
        id: affiliateData.id,
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
