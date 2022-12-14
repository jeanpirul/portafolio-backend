import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user';

@Entity('actionCliente')
export class ActionCliente extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int4' })
  public idActionCliente: number;

  @Column({ type: 'int4', nullable: true })
  public fk_User: number;

  @Column({ type: 'varchar', length: 80, nullable: true })
  public nombreResponsable: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public nombreRol: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public nombrePedido: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public estadoPedido: string;

  @Column({ type: 'bool', nullable: true })
  public pedidoEntregado: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public fecha?: Date;

  @Column({ type: 'varchar', length: 200, nullable: true })
  public detalleActionCliente: string;

  @ManyToOne(() => User, (user) => user.idUser)
  @JoinColumn([{ name: 'fk_User', referencedColumnName: 'idUser' }])
  user: User[];
}
