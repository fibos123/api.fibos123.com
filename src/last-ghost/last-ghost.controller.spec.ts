import { Test, TestingModule } from '@nestjs/testing';
import { LastGhostController } from './last-ghost.controller';

describe('LastGhostController', () => {
  let controller: LastGhostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LastGhostController],
    }).compile();

    controller = module.get<LastGhostController>(LastGhostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
