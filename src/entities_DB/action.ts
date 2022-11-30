import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user';

@Entity('action')
export class Action extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int4' })
  public idAction: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  public nameTableAction: string;

  @Column({ type: 'varchar', nullable: true })
  public fk_User: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public nameRole: string[] | string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public actionCreation?: Date;

  @Column({ type: 'varchar', length: 100, nullable: false })
  public userName: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  public actionDetail: string;

  @ManyToOne(() => User, (user) => user.idUser)
  @JoinColumn([{ name: 'fk_User', referencedColumnName: 'idUser' }])
  user: User[];
}
