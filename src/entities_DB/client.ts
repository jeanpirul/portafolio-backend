import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('client')
export class Client extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;
	@Column()
	firstName: string; 
	@Column()
	lastName: string;
	@Column()
	email: string;
	@Column()
	phone: string;
}
