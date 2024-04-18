import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { AuthService } from 'src/auth/auth.service';
import { UserModule } from 'src/user/user.module';
import { TweetRepository } from './tweet.repository';

@Module({imports: [UserModule, PrismaModule, JwtModule.register({secret:process.env.JWT_SECRET})],
controllers: [TweetController],
providers: [TweetService, AuthService, TweetRepository],}
)
export class TweetModule {
}
