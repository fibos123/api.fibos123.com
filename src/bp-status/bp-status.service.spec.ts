import { Test, TestingModule } from '@nestjs/testing';
import { BpStatusService } from './bp-status.service';

describe('BpStatusService', () => {
  let service: BpStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BpStatusService],
    }).compile();

    service = module.get<BpStatusService>(BpStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
