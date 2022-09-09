import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('warehouse')
export class Warehouse extends BaseEntity {
	@PrimaryGeneratedColumn()
	id_bodega: string;
	@Column()
	address: string;
	@Column()
	quantity: number;
	@Column()
	id_prod: string;
	@Column()
	id_prov: string;
}