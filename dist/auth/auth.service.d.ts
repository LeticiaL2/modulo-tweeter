import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UserToken } from './models/UserToken';
export declare class AuthService {
    private readonly jwtService;
    private readonly userService;
    constructor(jwtService: JwtService, userService: UserService);
    getUserIdFromToken(token: string): number;
    login(user: User): Promise<UserToken>;
    validateUser(email: string, password: string): Promise<User>;
}
