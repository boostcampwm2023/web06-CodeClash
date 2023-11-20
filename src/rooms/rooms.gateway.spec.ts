import { Test, TestingModule } from '@nestjs/testing';
import { RoomsGateway } from './rooms.gateway';
import { RoomsService } from './rooms.service';

describe('RoomsGateway', () => {
  let gateway: RoomsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomsGateway, RoomsService],
    }).compile();

    gateway = module.get<RoomsGateway>(RoomsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
