import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { LastGhostController } from './last-ghost/last-ghost.controller';
import { LastSnapshotController } from './last-snapshot/last-snapshot.controller';
import { BpStatusModule } from './bp-status/bp-status.module';
import { VersionModule } from './version/version.module';

@Module({
  imports: [ConfigModule.forRoot(), BpStatusModule, VersionModule],
  controllers: [AppController, LastGhostController, LastSnapshotController],
  providers: [],
})
export class AppModule {}
