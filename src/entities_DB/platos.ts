import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn, ManyToMany, OneToMany } from 'typeorm';
import { PlatoProduct } from './platosProduct';
import { Product } from './product';

@Entity('plato')
export class Plato extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int4' })
  public idPlato: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  public nombrePlato: string;

  @Column({ type: 'int4', nullable: true })
  public precioPlato: string;

  @OneToMany(() => PlatoProduct, (platoProduct) => platoProduct.product)
  platoProduct: PlatoProduct;
}
