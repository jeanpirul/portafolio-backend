import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Warehouse } from './Warehouse';

@Entity('product')
export class Product extends BaseEntity {
	@PrimaryGeneratedColumn()
	id_prod: string;
	@OneToMany(() => Warehouse, (wharehouse) => wharehouse.id_warehouse)
    wharehouse: Warehouse[]
	@Column()
	availability: string;
	@Column()
	price: number;
}