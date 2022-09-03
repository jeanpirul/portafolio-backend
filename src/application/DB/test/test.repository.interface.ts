import { CreateTestdataDTO } from '../../../dto/test.dto';
import { TestEntity } from '../../../entities/test.entities';

export interface ITestRepository {
	createTest(data: CreateTestdataDTO): Promise<TestEntity>;
}
