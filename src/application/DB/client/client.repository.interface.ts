import { CreateClientDataDTO } from '../../../dto/client.dto';
import { ClientEntity } from '../../../entities/client';

export interface IClientRepository {
	createClient(data: CreateClientDataDTO): Promise<ClientEntity>;
}
