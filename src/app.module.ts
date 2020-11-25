import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BpStatusController } from './bp-status/bp-status.controller';
import { LastGhostController } from './last-ghost/last-ghost.controller';
import { LastSnapshotController } from './last-snapshot/last-snapshot.controller';

@Module({
  imports: [],
  controllers: [AppController, BpStatusController, LastGhostController, LastSnapshotController],
  providers: [],
})
export class AppModule { }
