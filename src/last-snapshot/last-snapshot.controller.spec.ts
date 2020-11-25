import { Test, TestingModule } from '@nestjs/testing';
import { LastSnapshotController } from './last-snapshot.controller';

describe('LastSnapshotController', () => {
  let controller: LastSnapshotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LastSnapshotController],
    }).compile();

    controller = module.get<LastSnapshotController>(LastSnapshotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
