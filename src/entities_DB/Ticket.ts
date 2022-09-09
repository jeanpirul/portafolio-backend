import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ticket')
export class Ticket extends BaseEntity {
	@PrimaryGeneratedColumn()
	id_ticket: string;
	@Column()
	address: string;
	@Column()
	quantity: number;
	@Column()
	id_prod: string;
	@Column()
	id_prov: string;
}