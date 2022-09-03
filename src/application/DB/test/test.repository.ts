import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { TestEntity } from '../../../entities/test.entities';

// @Entity() is a decorator that tells TypeORM that this class is a table in the database
@Entity('test')
export class Test extends BaseEntity implements TestEntity {
	// @PrimaryGeneratedColumn() is a decorator that tells TypeORM that this property is a primary key in the database
	@PrimaryGeneratedColumn()
	id!: string;
	// @Column() is a decorator that tells TypeORM that this property is a column in the database
	@Column({ nullable: true })
	firstName!: string;
	@Column({ nullable: true })
	lastName!: string;
}
