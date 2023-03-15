import { Controller, Get } from '@nestjs/common';
import { BpStatus } from '../interfaces/BpStatus';
import { BpStatusService } from './bp-status.service';

@Controller('bp_status')
export class BpStatusController {
  constructor(private bpStatusService: BpStatusService) {}

  @Get()
  getBpStatus(): BpStatus {
    return this.bpStatusService.getBpStatus();
  }
}
