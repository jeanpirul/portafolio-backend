import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product';

@Entity('warehouse')
export class Warehouse extends BaseEntity {
	@PrimaryGeneratedColumn()
	id_warehouse: string;
	@Column()
	address: string;
	@Column()
	quantity: number;
	@ManyToOne(() => Product, (product) => product.id_prod)
    product: Product
	@Column()
	id_prov: string;
}