import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('actionPedido')
export class ActionPedido extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int4' })
  public idActionPedido: number;

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
  public mesa: string;

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
}
