import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { User } from "./user";

@Entity("rol")
export class Rol extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int4" })
  public idRol: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  public nameRol: string;

  @OneToOne(() => User, (user) => user.rol)
  user: User;
}
