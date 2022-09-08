import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product')
export class Product extends BaseEntity {
	@PrimaryGeneratedColumn()
	id_prod: string;
	@Column()
	id_bodega: string;
	@Column()
	availability: string;
	@Column()
	price: number;
}