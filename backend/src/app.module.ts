import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/modules-system/prisma/prisma.module';
import { AuthModule } from './modules/modules-api/auth/auth.module';
import { TokenModule } from './modules/modules-system/token/token.module';

// import { ImageModule } from './modules/modules-api/image/image.module';
import { UserModule } from './modules/modules-api/user/user.module';
// import { CommentModule } from './modules/modules-api/comment/comment.module';
import { FileModule } from './modules/modules-api/file/file.module';
import { HealthModule } from './modules/modules-api/health/health.module';
import { LixiSessionModule } from './modules/modules-api/lixi-session/lixi-session.module';
import { FeedbackModule } from './modules/modules-api/feedback/feedback.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TokenModule,
    UserModule,
    FileModule,
    HealthModule,
    LixiSessionModule,
    FeedbackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
//ArticleModule
