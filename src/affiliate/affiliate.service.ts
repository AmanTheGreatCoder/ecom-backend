import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAffiliateLinkDto } from './dto/create-affiliateLink.dto';
import { CreateAffiliateDto } from './dto/create-affiliate.dto';

@Injectable()
export class AffiliateService {
  constructor(private readonly prisma: PrismaService) {}

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

    if (!affiliate.id) {
      throw new BadRequestException('Affiliate not found');
    }

    return await this.prisma.affiliateLink.create({
      data: {
        affiliateId: dto.affiliateId,
        productId: dto.productId,
        link: `http://localhost:3000/products/${dto.productId}?code=${dto.affiliateId}`,
      },
    });
  }

  async create(createAffiliateDto: CreateAffiliateDto) {
    const { name, email } = createAffiliateDto;
    return this.prisma.affiliate.create({
      data: {
        name,
        email,
      },
    });
  }

  async registerClick(id: number) {
    const affiliateLink = await this.prisma.affiliateLink.findFirst({
      where: {
        affiliateId: id,
      },
    });

    if (!affiliateLink.id) {
      throw new BadRequestException('Invalid affiliate');
    }

    await this.prisma.affiliate.update({
      where: {
        id: id,
      },
      data: {
        visits: {
          increment: 1,
        },
      },
    });

    await this.prisma.affiliateLink.update({
      where: {
        id: affiliateLink.id,
      },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });
  }
}
