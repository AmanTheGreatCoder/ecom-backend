import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData(affiliateId: number) {
    const affiliateData = await this.prisma.affiliate.findUnique({
      where: {
        id: affiliateId,
      },
      include: {
        affiliateLinks: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!affiliateData.id) {
      throw new BadRequestException('Affiliate not found');
    }

    return {
      conversionRate: affiliateData.conversion_rate,
      commissionRate: affiliateData.commission,
      totalEarnings: affiliateData.totalEarnings.toFixed(2),
      totalVisits: affiliateData.visits,
      totalSales: affiliateData.total_sales,
      visitsToday: affiliateData.visits_today,
      affiliate_links: affiliateData.affiliateLinks,
    };
  }
}
