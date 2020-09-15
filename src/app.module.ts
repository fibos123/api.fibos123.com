import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BpStatusController } from './bp-status/bp-status.controller';
import { LastGhostController } from './last-ghost/last-ghost.controller';

@Module({
  imports: [],
  controllers: [AppController, BpStatusController, LastGhostController],
  providers: [],
})
export class AppModule { }
