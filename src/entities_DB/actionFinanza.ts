import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('actionFinanza')
export class ActionFinanza extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int4' })
  public idActionFinanza: number;

  @Column({ type: 'varchar', length: 80, nullable: true })
  public nombreResponsable: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public nombreRol: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public fecha?: Date;

  @Column({ type: 'int4', nullable: true })
  public totalIngresos: number;

  @Column({ type: 'int4', nullable: true })
  public totalEgresos: number;

  @Column({ type: 'int4', nullable: true })
  public totalGanancia: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  public detalleActionFinanza: string;
}
