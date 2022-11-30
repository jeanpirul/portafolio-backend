import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user';

@Entity('actionBodega')
export class ActionBodega extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int4' })
  public idActionBodega: number;

  @Column({ type: 'varchar', length: 80, nullable: true })
  public nombreResponsable: string;

  @Column({ type: 'int4', nullable: true })
  public fk_User: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public nombreRol: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public nombreProducto: string;

  @Column({ type: 'int4', nullable: true })
  public cantidad: number;

  @Column({ type: 'int4', nullable: true })
  public precio: number;

  @Column({ type: 'int4', nullable: true })
  public totalPago: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public fechaCreacion?: Date;

  @Column({ type: 'varchar', length: 200, nullable: true })
  public detalleActionBodega: string;

  @ManyToOne(() => User, (user) => user.idUser)
  @JoinColumn([{ name: 'fk_User', referencedColumnName: 'idUser' }])
  user: User[];
}
