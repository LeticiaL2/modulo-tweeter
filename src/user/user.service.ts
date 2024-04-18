import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const userToCreate: CreateUserDto = {
      ...createUserDto,
      password: hashedPassword,
    };
    return await this.userRepository.create(userToCreate);
  }

  findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
}
