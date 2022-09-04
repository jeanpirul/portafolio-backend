import { ClientEntity } from '../entities/client';

export type CreateClientDataDTO = Omit<ClientEntity, 'id'>;

// export interface CreateClientdataDTOO {
// 	firstName: string;
// 	lastName: string;
// }
