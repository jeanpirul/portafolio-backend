import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TestEntity } from '../entities/test.entities';

@Entity('test')
export class Test extends BaseEntity {
	@PrimaryGeneratedColumn()
    id!: string;
	@Column()
    firstName!: string;
	@Column()
    lastName!: string;
}
