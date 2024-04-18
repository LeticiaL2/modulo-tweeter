import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { TweetController } from './tweet/tweet.controller';
import { UserController } from './user/user.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { TweetModule } from './tweet/tweet.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { TweetService } from './tweet/tweet.service';
import { TweetRepository } from './tweet/tweet.repository';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, TweetModule, JwtModule],
  controllers: [AppController, HealthController, TweetController, UserController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AuthService,
    TweetService,
    TweetRepository
  ],
})
export class AppModule {}
