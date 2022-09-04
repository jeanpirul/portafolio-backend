// import { getRepository } from 'typeorm';
// import { CreateClientDataDTO } from '../../../dto/client.dto';
// import { ClientEntity } from '../../../entities/client';
// import { entities_db } from '../../../entities_DB/entities_db';
// import { IClientRepository } from './client.repository.interface';

// export class ClientRepository implements IClientRepository {
// 	async createClient(data: CreateClientDataDTO): Promise<ClientEntity> {
// 		return await getRepository(entities_db.Client)
// 			.create(data)
// 			.then((res) => {
// 				console.log('[DB Client] Agregado correctamente...');
// 				return res;
// 			})
// 			.catch((err) => {
// 				throw new Error('DB Client Error ' + err.message);
// 			});
// 	}
// }
