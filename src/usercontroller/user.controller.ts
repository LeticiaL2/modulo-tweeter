import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('api/users')
export class UserController {
  private users: {username: string; email: string; password: string }[] = [];

  @Post()
  createUser(@Body() user: { username: string; email: string; password: string }, @Res() res: Response): { username: string; email: string } {
    const newUser = {
      username: user.username,
      email: user.email,
      password: user.password,
    };
    this.users.push(newUser);
    res.status(HttpStatus.CREATED).send(this.users); 
    return { username: newUser.username, email: newUser.email };
  }

  @Post('login')
  loginUser(@Body() credentials: { email: string; password: string }, @Res() res: Response): any {
    const user = this.users.find(u => u.email === credentials.email);
    if (user && user.password === credentials.password) {
      return res.status(HttpStatus.OK).json({ message: 'Login OK', user: { username: user.username, email: user.email } });
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Erro no login' });
    }
  }

}

