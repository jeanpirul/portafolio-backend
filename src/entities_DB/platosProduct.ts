import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Plato } from './platos';
import { Product } from './product';

@Entity('platoProduct')
export class PlatoProduct extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int4' })
  public idPlatoProduct: number;

  @Column({ type: 'int4', nullable: true })
  public fk_Plato: number;

  @Column({ type: 'int4', nullable: true })
  public fk_Product: number;

  @ManyToOne(() => Plato, (plato) => plato.idPlato)
  @JoinColumn([{ name: 'fk_Plato', referencedColumnName: 'idPlato' }])
  plato: Plato;

  @ManyToOne(() => Product, (product) => product.idProduct)
  @JoinColumn([{ name: 'fk_Product', referencedColumnName: 'idProduct' }])
  product: Product;
}
