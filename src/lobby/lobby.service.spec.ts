import { Test, TestingModule } from '@nestjs/testing';
import { LobbyService } from './lobby.service';

describe('LobbyService', () => {
  let service: LobbyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LobbyService],
    }).compile();

    service = module.get<LobbyService>(LobbyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
