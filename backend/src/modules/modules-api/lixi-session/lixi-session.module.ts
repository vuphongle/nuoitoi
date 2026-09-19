import { Module } from '@nestjs/common';
import { LixiSessionService } from './lixi-session.service';
import { LixiSessionAdminController } from './lixi-session.admin.controller';
import { LixiSessionController } from './lixi-session.controller';
import { FileModule } from '../file/file.module';

@Module({
  imports: [FileModule],
  controllers: [LixiSessionAdminController, LixiSessionController],
  providers: [LixiSessionService],
})
export class LixiSessionModule {}
