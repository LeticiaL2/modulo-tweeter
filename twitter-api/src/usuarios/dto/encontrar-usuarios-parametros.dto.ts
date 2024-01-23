import { ParametrosConsultaBaseDto } from 'src/shared/parametros-consulta-base.dto';

export class EncontrarUsuariosParametrosDto extends ParametrosConsultaBaseDto {
	id: string;
	nome: string;
	email: string;
	usuario: string;
	ativo: boolean;
}