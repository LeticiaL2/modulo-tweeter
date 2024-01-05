import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { CriarTweetDto } from './dto/criar-tweet.dto';
import { RetornoTweetDto } from './dto/retorno-tweet.dto';
import { GetIdUsuario } from 'src/usuarios/decorator/get-id-usuario.decorator';
import { AuthGuard } from '@nestjs/passport';
@Controller('tweets')
export class TweetsController {
	constructor(private tweetsService: TweetsService) {}

	@Post()
	@UseGuards(AuthGuard())
	async criarTweet(
		@Body(ValidationPipe) criarTweetDto: CriarTweetDto,
		@GetIdUsuario() idUsuario: string,
	): Promise<RetornoTweetDto> {
		try {
			const tweet = await this.tweetsService.criarTweet(criarTweetDto, idUsuario);
			return {
				conteudo: tweet,
				mensagem: {
					codigo: 201,
					texto: 'Tweet criado com sucesso.',
				},
				status: true,
			};
		} catch (error) {
			return {
				conteudo: null,
				mensagem: {
					codigo: 500,
					texto: 'Erro interno do servidor',
				},
				status: false,
			};
		}
	}

	@Get(':id')
	@UseGuards(AuthGuard())
	async encontrarTweetPeloId(@Param('id') id): Promise<RetornoTweetDto> {
		try {
			const tweet = await this.tweetsService.encontrarTweetPeloId(id);

			return {
				conteudo: tweet,
				mensagem: {
					codigo: 200,
					texto: 'Tweet encontrado',
				},
				status: true,
			};
		} catch (error) {
			if (error instanceof NotFoundException)
				return {
					conteudo: null,
					mensagem: {
						codigo: 404,
						texto: 'Tweet não encontrado',
					},
					status: false,
				};
			else {
				return {
					conteudo: null,
					mensagem: {
						codigo: 500,
						texto: 'Erro interno do servidor',
					},
					status: false,
				};
			}
		}
	}

	@Delete(':id')
	@UseGuards(AuthGuard())
	async deletarUsuario(
		@GetIdUsuario() idUsuario: string,
		@Param('id') id: string,
	) {
		try {
			await this.tweetsService.deletarTweet(id, idUsuario);
			return {
				conteudo: null,
				mensagem: {
					codigo: 200,
					texto: 'Tweet removido com sucesso',
				},
				status: true,
			};
		} catch (error) {
			if (error instanceof NotFoundException)
				return {
					conteudo: null,
					mensagem: {
						codigo: 404,
						texto: 'Tweet não encontrado',
					},
					status: false,
				};
			else {
				return {
					conteudo: null,
					mensagem: {
						codigo: 500,
						texto: 'Erro interno do servidor',
					},
					status: false,
				};
			}
		}
	}
}