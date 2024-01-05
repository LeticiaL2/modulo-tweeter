import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AutenticacaoModule } from './autenticacao/autenticacao.module';
import { TweetsModule } from './tweets/tweets.module';
@Module({
	imports: [
		TypeOrmModule.forRoot(typeOrmConfig),
		UsuariosModule,
		AutenticacaoModule,
		TweetsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}