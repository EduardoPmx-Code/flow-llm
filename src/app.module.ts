import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketIaModule } from './socket-ia/socket-ia.module';
import { LayersIaModule } from './layers-ia/layers-ia.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [SocketIaModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
