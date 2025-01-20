import { Test, TestingModule } from '@nestjs/testing';
import { SocketIaService } from './socket-ia.service';

describe('SocketIaService', () => {
  let service: SocketIaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketIaService],
    }).compile();

    service = module.get<SocketIaService>(SocketIaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
