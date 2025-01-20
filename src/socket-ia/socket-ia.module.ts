import { Module } from '@nestjs/common';
import { SocketIaService } from './socket-ia.service';
import { SocketIaGateway } from './socket-ia.gateway';
import { LayersIaModule } from 'src/layers-ia/layers-ia.module';

@Module({
  imports: [LayersIaModule],
  providers: [SocketIaGateway, SocketIaService],
})
export class SocketIaModule {}
