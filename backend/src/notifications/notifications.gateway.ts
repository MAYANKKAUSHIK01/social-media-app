import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: { userId: string }) {
    client.join(`user_${payload.userId}`);
  }

  notifyUser(userId: string, message: string) {
    this.server.to(`user_${userId}`).emit('notification', { message });
  }
}