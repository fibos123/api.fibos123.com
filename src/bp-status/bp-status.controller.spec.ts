import { Test, TestingModule } from '@nestjs/testing';
import { BpStatusController } from './bp-status.controller';

describe('BpStatusController', () => {
  let controller: BpStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BpStatusController],
    }).compile();

    controller = module.get<BpStatusController>(BpStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
