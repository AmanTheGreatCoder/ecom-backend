import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { addDays } from 'date-fns';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData(id: number) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: {
        id: id,
      },
      include: {
        affiliateLinks: true,
      },
    });

    if (!affiliate.id) {
      throw new BadRequestException('Affiliate not found');
    }

    const totalClicks = affiliate.affiliateLinks.reduce(
      (sum, link) => sum + link.clicks,
      0,
    );

    const totalRevenue = affiliate.affiliateLinks.reduce(
      (sum, link) => sum + link.totalRevenue,
      0,
    );

    const conversionRate = totalClicks ? (totalRevenue / totalClicks) * 100 : 0;

    // Calculate visits today
    const todayStart = addDays(new Date().setHours(0, 0, 0, 0), 0);
    const todayEnd = addDays(new Date().setHours(23, 59, 59, 999), 0);

    const visitsToday = await this.prisma.affiliateLink.count({
      where: {
        affiliateId: id,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    return {
      conversionRate: conversionRate.toFixed(2), // Rounded to 2 decimal places
      commissionRate: affiliate.commission,
      totalEarnings: affiliate.totalEarnings.toFixed(2),
      totalVisits: affiliate.visits,
      visitsToday: visitsToday,
    };
  }
}
