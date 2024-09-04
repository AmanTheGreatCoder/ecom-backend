import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AffiliateService } from './affiliate.service';
import { AffiliateController } from './affiliate.controller';

@Module({
  imports: [PrismaModule],
  providers: [AffiliateService],
  controllers: [AffiliateController],
  exports: [],
})
export class AffiliateModule {}
