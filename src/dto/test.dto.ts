import { TestEntity } from '../entities/test.entities';

export type CreateTestdataDTO = Omit<TestEntity, 'id'>;

export interface CreateTestdataDTOO {
	firstName: string;
	lastName: string;
}
