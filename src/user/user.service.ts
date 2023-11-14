import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseModel } from 'src/auth/models/ResponseModels';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<ResponseModel<{ usuario: string; email: string; nome: string }>> {
    const emailExists = await this.findByEmail(createUserDto.email);
    if (emailExists) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 400,
          texto: 'Email já existe',
        },
        conteudo: null,
      });
    }

    const usernameExists = await this.findByUsername(createUserDto.usuario);
    if (usernameExists) {
      return {
        status: false,
        mensagem: {
          codigo: 400,
          texto: 'Usuário já existe',
        },
        conteudo: null,
      };
    }

    const data = {
      ...createUserDto,
      senha: await bcrypt.hash(createUserDto.senha, 10),
      ativo: true,
      data_criacao: new Date(),
      data_atualizacao: new Date(),
      data_ativacao: new Date(),
    };

    const createdUser = await this.prisma.usuario.create({ data });

    return {
      status: true,
      mensagem: {
        codigo: 201,
        texto: 'Usuário criado com sucesso',
      },
      conteudo: {
        usuario: createdUser.usuario,
        email: createdUser.email,
        nome: createdUser.nome,
      },
    };
  }

  findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.usuario.findUnique({
      where: { usuario: username },
    });
  }
}
