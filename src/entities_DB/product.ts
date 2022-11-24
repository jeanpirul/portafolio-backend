import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Plato } from './platos';
import { User } from './user';

@Entity('product')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int4' })
  public idProduct: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  public nombreProducto: string;

  @Column({ type: 'int4', nullable: true })
  public cantidad: number;

  @Column({ type: 'int4', nullable: true })
  public precio: number;

  @Column({ type: 'int4', nullable: true })
  public fk_User: number;

  @ManyToOne(() => User, (user) => user.idUser)
  @JoinColumn([{ name: 'fk_User', referencedColumnName: 'idUser' }])
  user: User[];

  @OneToMany(() => Plato, (plato) => plato.product)
  plato: Plato;
}
