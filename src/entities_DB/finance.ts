import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user';

@Entity('finance')
export class Finance extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int4' })
  public idFinance: number; //Identificador del cliente

  @Column({ type: 'int4', nullable: true })
  public totalIncome: number; //ingresos totales referenciados a ventas del restaurant.

  @Column({ type: 'int4', nullable: true })
  public totalExpenses: number; // Egresos totales del restaurant.

  @Column({ type: 'varchar', length: 150, nullable: true })
  public purchaseDetail: string; //Detalle de compras del restaurant.

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public purchaseDate?: Date; //Fecha de compras del restaurant.

  @Column({ type: 'int4', nullable: true })
  public fk_User: number;

  @ManyToOne(() => User, (user) => user.idUser)
  @JoinColumn([{ name: 'fk_User', referencedColumnName: 'idUser' }])
  user: User[];
}
