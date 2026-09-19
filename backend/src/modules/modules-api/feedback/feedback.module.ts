import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackAdminController } from './feedback.admin.controller';
import { FeedbackController } from './feedback.controller';

@Module({
  controllers: [FeedbackAdminController, FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
