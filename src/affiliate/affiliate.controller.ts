import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AffiliateService } from './affiliate.service';

@ApiTags('Affiliate')
@Controller('affiliate')
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Post('/link/:id')
  async createAffiliateLink(@Param('id', ParseIntPipe) id: number) {
    return await this.affiliateService.createAffiliateLink(id);
  }

  @Get('/links')
  async getAllAffiliateLinksForAffiliate() {
    return await this.affiliateService.getAllAffiliateLinksData();
  }

  @Post('/click/:id')
  async registerClick(@Param('id', ParseIntPipe) id: number) {
    return await this.affiliateService.registerClick(id);
  }
}
