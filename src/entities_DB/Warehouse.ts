import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product';

@Entity('warehouse')
export class Warehouse extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;
	@Column()
	address: string;
	@Column()
	quantity: number;
	@ManyToOne(() => Product, (product) => product.id)
	product: Product;
	@Column()
	id_prov: string;
}
