import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { Product } from './product';

@Entity('plato')
export class Plato extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int4' })
  public idPlato: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  public nombrePlato: string;

  @Column({ type: 'int4', nullable: true })
  public precioPlato: string;

  @Column({ type: 'int4', nullable: true })
  public fk_Product: number;

  @ManyToOne(() => Product, (product) => product.idProduct)
  @JoinColumn([{ name: 'fk_Product', referencedColumnName: 'idProduct' }])
  product: Product[];
}
