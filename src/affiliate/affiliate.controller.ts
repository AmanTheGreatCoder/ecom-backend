import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AffiliateService } from './affiliate.service';
import { CreateAffiliateLinkDto } from './dto/create-affiliate-link.dto';

@ApiTags('Affiliate')
@Controller('affiliate')
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Post('/link')
  async createAffiliateLink(@Body() dto: CreateAffiliateLinkDto) {
    return await this.affiliateService.createAffiliateLink(dto);
  }

  @Get('/links/:affiliateId')
  async getAllAffiliateLinksForAffiliate(
    @Param('affiliateId', ParseIntPipe) affiliateId: number,
  ) {
    return await this.affiliateService.getAllAffiliateLinksData(affiliateId);
  }

  @Post('/click/:affiliateLinkId')
  async registerClick(
    @Param('affiliateLinkId', ParseIntPipe) affiliateLinkId: number,
  ) {
    return await this.affiliateService.registerClick(affiliateLinkId);
  }
}
