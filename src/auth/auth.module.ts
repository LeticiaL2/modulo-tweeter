import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { jwtSecret } from '../config/config';

@Module({
    controllers: [AuthController],
    imports: [
        UsersModule, 
        PassportModule, 
        JwtModule.register({
            secret: jwtSecret.secret,
            signOptions: { expiresIn: '60s' },
        }),
    ],
    providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
