import { Controller, Get } from '@nestjs/common';
import { BpStatus } from 'src/interfaces/BpStatus';
import bpStatus from './bpStatus';

@Controller('bp_status')
export class BpStatusController {

  @Get()
  getHello(): Promise<BpStatus> {
    return bpStatus()
  }

}
