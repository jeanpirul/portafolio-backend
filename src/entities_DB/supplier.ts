import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// Proveedor
@Entity('supplier')
export class Supplier extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;
	@Column()
	name: string;
	@Column()
	contact: string;
	@Column()
	supplier_type: string;
    @Column()
	product_type: string;
}