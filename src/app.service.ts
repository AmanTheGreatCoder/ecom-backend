import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData() {
    const id = 2;
    const affiliateData = await this.prisma.affiliate.findUnique({
      where: {
        id: id,
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
    console.log('affiliate', affiliateData);

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
