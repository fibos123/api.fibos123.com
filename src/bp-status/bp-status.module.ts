import { Module } from '@nestjs/common';
import { BpStatusService } from './bp-status.service';
import { BpStatusController } from './bp-status.controller';

@Module({
  providers: [BpStatusService],
  controllers: [BpStatusController]
})
export class BpStatusModule {}
