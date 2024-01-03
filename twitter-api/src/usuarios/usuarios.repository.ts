import { DataSource, Repository } from 'typeorm';
import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { Usuario } from './usuario.entity';
import { EncontrarUsuariosParametrosDto } from './dto/encontrar-usuarios-parametros.dto';
import { CredenciaisDto } from 'src/autenticacao/credenciais.dto';

@Injectable()
export class UsuariosRepository extends Repository<Usuario> {
	constructor(private dataSource: DataSource) {
		super(Usuario, dataSource.createEntityManager());
	}

	async encontrarUsuarios(
		consultaDto: EncontrarUsuariosParametrosDto,
	): Promise<{ usuarios: Usuario[]; total: number }> {
		const { email, nome, usuario, ativo, id } = consultaDto;
		const consulta = this.createQueryBuilder('usuario');

		consulta.where('usuario.ativo = :ativo', { ativo });

		if (email) {
			consulta.andWhere('usuario.email ILIKE :email', { email: `%${email}%` });
		}

		if (nome) {
			consulta.andWhere('usuario.nome ILIKE :nome', { nome: `%${nome}` });
		}

		if (usuario) {
			consulta.andWhere('usuario.usuario ILIKE :usuario', {
				usuario: `%${usuario}%`,
			});
		}

		if (id) {
			consulta.andWhere('usuario.id ILIKE :id', { id: `%${id}` });
		}

		consulta.skip((consultaDto.pagina - 1) * consultaDto.limite);
		consulta.take(+consultaDto.limite);
		const orderColumn = consultaDto.ordenar
			? JSON.parse(consultaDto.ordenar)
			: undefined;
		const orderDirection = consultaDto.ordenarPor
			? consultaDto.ordenarPor
			: 'ASC';

		consulta.orderBy({
			[orderColumn]: orderDirection,
		});

		consulta.select([
			'usuario.id',
			'usuario.nome',
			'usuario.usuario',
			'usuario.email',
			'usuario.ativo',
		]);

		const [usuarios, total] = await consulta.getManyAndCount();

		return { usuarios, total };
	}

	async criarUsuario(usuario: Usuario): Promise<Usuario> {
		const novoUsuario = this.create(usuario);

		try {
			await novoUsuario.save();
			delete novoUsuario.senha;
			delete novoUsuario.salt;
			return novoUsuario;
		} catch (error) {
			if (error.code.toString() === '23505') {
				throw new ConflictException('Endereço de email já está em uso');
			} else {
				throw new InternalServerErrorException(
					'Erro ao salvar o usuário no banco de dados',
				);
			}
		}
	}

	async checarCredenciais(credenciaisDto: CredenciaisDto): Promise<Usuario> {
		const { email, senha } = credenciaisDto;
		const usuario = await this.findOne({ where: { email, ativo: true } });

		if (usuario && (await usuario.checarSenha(senha))) {
			return usuario;
		} else {
			return null;
		}
	}
}