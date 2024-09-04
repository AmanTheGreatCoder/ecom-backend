import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('dashboard')
  async getDashboardData(@Query('id', ParseIntPipe) id: number) {
    console.log('idddd', id);
    return this.appService.getDashboardData(id);
  }
}
