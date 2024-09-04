import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaService } from './prisma/prisma.service';

interface Stock {
  id: number;
  stock: number;
}

@WebSocketGateway({ cors: true })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server) {
    console.log('WebSocket server initialized');
    this.sendStockUpdates();
  }

  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  async updateStockRandomly(stocks: Stock[]) {
    const updatePromises = stocks.map((stock) => {
      const newStock = Math.floor(Math.random() * 100); // Random stock value between 0 and 99
      return this.prisma.product.update({
        where: { id: stock.id },
        data: { stock: newStock },
      });
    });

    await Promise.all(updatePromises);

    console.log('Stock data updated.');
  }

  async sendStockUpdates() {
    setInterval(async () => {
      const products = await this.prisma.product.findMany({
        select: {
          id: true,
          stock: true,
        },
      });
      this.server.emit('stockUpdate', products);

      console.log('Stock data emitted');
      this.updateStockRandomly(products);
    }, 5000);
  }
}
