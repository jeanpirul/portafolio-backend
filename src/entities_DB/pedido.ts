import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user';

@Entity('pedido')
export class Pedido extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int4' })
  public idPedido: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  public nombrePedido: string;

  @Column({ type: 'int4', nullable: true })
  public cantidad: number;

  @Column({ type: 'int4', nullable: true })
  public precio: number;

  @Column({ type: 'int4', nullable: true })
  public total: number;

  @Column({ type: 'varchar', nullable: true })
  public tipoPago: string;

  @Column({ type: 'varchar', nullable: true })
  public mesa: string;

  @Column({ type: 'varchar', nullable: true })
  public cantidadPersonas: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public fecha?: Date;

  @Column({ type: 'int4', nullable: true })
  public fk_User: number;

  @ManyToOne(() => User, (user) => user.idUser)
  @JoinColumn([{ name: 'fk_User', referencedColumnName: 'idUser' }])
  user: User[];
}
