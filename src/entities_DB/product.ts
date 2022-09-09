import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Warehouse } from './warehouse';

@Entity('product')
export class Product extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;
	@OneToMany(() => Warehouse, (warehouse) => warehouse.id)
	warehouse: Warehouse[];
	@Column()
	availability: string;
	@Column()
	price: number;
}
