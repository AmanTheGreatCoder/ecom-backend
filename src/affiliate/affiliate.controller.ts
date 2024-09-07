import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AffiliateService } from './affiliate.service';
import { CreateAffiliateLinkDto } from './dto/create-affiliate-link.dto';
import { RegisterClickDto } from './dto/register-click.dto';

@ApiTags('Affiliate')
@Controller('affiliate')
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Post('/link')
  async createAffiliateLink(@Body() dto: CreateAffiliateLinkDto) {
    return await this.affiliateService.createAffiliateLink(dto);
  }

  @Post('/click')
  async registerClick(@Body() dto: RegisterClickDto) {
    return await this.affiliateService.registerClick(dto);
  }
}
