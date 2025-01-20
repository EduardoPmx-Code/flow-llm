import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayConnection,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { SocketIaService } from './socket-ia.service';
import { CreateSocketIaDto } from './dto/create-socket-ia.dto';
import { UpdateSocketIaDto } from './dto/update-socket-ia.dto';
import { Server, Socket } from 'socket.io';
@WebSocketGateway()
export class SocketIaGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userRooms = new Map<string, string>();
  private clients = new Map<string, Socket>();
  constructor(private readonly socketIaService: SocketIaService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.clients.set(client.id, client); // Store client
  }

  handleDisconnect(client: Socket) {
    const room = this.userRooms.get(client.id);
    if (room) {
      client.leave(room);
      this.userRooms.delete(client.id);
      this.clients.delete(client.id); // Remove client from map
      console.log(`Client disconnected and left room: ${room}`);
    }
  }

  @SubscribeMessage('createRoom')
  createRoom(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!client) {
      console.error('Client is undefined');
      return { error: 'Client is undefined.' };
    }

    const roomName = `user-${data.userId}`;
    console.log(`Creating room: ${roomName}`);
    client.join(roomName);
    this.userRooms.set(client.id, roomName);
    return { message: `Room ${roomName} created and joined.` };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() messageData: { userId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!client) {
      console.error('Client is undefined');
      return { error: 'Client is undefined.' };
    }

    const room = this.userRooms.get(client.id);
    if (room) {
      try {
        const response = await this.socketIaService.generateResponse(
          messageData.message,
        );

        this.server.to(room).emit('message', { message: response });
        return { message: response };
      } catch (error) {
        console.error('Error sending message:', error);
        return { error: 'Failed to send message.' };
      }
    }
    return { error: 'User is not in a room.' };
  }
}
