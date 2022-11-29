import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { PlatoProduct } from './platosProduct';

@Entity('plato')
export class Plato extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int4' })
  public idPlato: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  public nombrePlato: string;

  @Column({ type: 'int4', nullable: true })
  public precioPlato: string;

  @Column({ type: 'varchar', nullable: true })
  public imagen: string;

  @OneToMany(() => PlatoProduct, (platoProduct) => platoProduct.product)
  platoProduct: PlatoProduct;
}
