import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ClientEntity } from '../entities/client';

@Entity('client')
export class Client extends BaseEntity {
	@PrimaryGeneratedColumn()
    id!: string;
	@Column()
    firstName!: string;
	@Column()
    lastName!: string;
}
