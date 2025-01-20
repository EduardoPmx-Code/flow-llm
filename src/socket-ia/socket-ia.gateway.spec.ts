import { Test, TestingModule } from '@nestjs/testing';
import { SocketIaGateway } from './socket-ia.gateway';
import { SocketIaService } from './socket-ia.service';

describe('SocketIaGateway', () => {
  let gateway: SocketIaGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketIaGateway, SocketIaService],
    }).compile();

    gateway = module.get<SocketIaGateway>(SocketIaGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
