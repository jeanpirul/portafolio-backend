import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";

@Entity("role")
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  public idRole: string;

  @Column({ type: "varchar", length: 20, nullable: false })
  public nameRole: string;

  @Column({ type: "varchar", nullable: false })
  @ManyToOne(() => User, (user) => user.idUser)
  // @JoinColumn({ name: "idUser" })
  public idUser: User;
}
