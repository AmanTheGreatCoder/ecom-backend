import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('dashboard/:affiliateId')
  async getDashboardData(
    @Param('affiliateId', ParseIntPipe) affiliateId: number,
  ) {
    return this.appService.getDashboardData(affiliateId);
  }
}
