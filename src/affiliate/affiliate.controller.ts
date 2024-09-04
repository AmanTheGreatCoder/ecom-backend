import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AffiliateService } from './affiliate.service';
import { CreateAffiliateDto } from './dto/create-affiliate.dto';
import { CreateAffiliateLinkDto } from './dto/create-affiliateLink.dto';

@ApiTags('Affiliate')
@Controller('affiliate')
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Post()
  async createAffiliate(@Body() createAffiliateDto: CreateAffiliateDto) {
    return this.affiliateService.create(createAffiliateDto);
  }

  @Post('/link')
  async createAffiliateLink(@Body() dto: CreateAffiliateLinkDto) {
    return await this.affiliateService.createAffiliateLink(dto);
  }

  @Post('/click/:id')
  async registerClick(@Param('id', ParseIntPipe) id: number) {
    return await this.affiliateService.registerClick(id);
  }
}
