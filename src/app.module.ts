import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketGateway } from './socket.gateway';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [PrismaModule, ProductModule],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
})
export class AppModule {}
