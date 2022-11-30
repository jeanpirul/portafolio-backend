import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';

@Entity('actionPedido')
export class ActionPedido extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int4' })
  public idActionPedido: number;

  @Column({ type: 'int4', nullable: true })
  public fk_User: number;

  @Column({ type: 'varchar', length: 80, nullable: true })
  public nombreResponsable: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public nombreRol: string;

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
  public mesa: number;

  @Column({ type: 'varchar', nullable: true })
  public cantidadPersonas: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public fecha?: Date;

  @Column({ type: 'varchar', length: 200, nullable: true })
  public detalleActionPedido: string;

  @ManyToOne(() => User, (user) => user.idUser)
  @JoinColumn([{ name: 'fk_User', referencedColumnName: 'idUser' }])
  user: User[];
}
