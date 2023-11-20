import { Test, TestingModule } from '@nestjs/testing';
import { LobbyGateway } from './lobby.gateway';
import { LobbyService } from './lobby.service';

describe('LobbyGateway', () => {
  let gateway: LobbyGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LobbyGateway, LobbyService],
    }).compile();

    gateway = module.get<LobbyGateway>(LobbyGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
