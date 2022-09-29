import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('product')
export class Product extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;
	@Column()
	idWarehouse:string
	@Column()
	availability: string;
	@Column()
	price: number;
}
