import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { User } from "./user";

@Entity("rol")
export class Rol extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int4" })
  public idRol: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  public nameRol: string;

  @OneToMany(() => User, (user) => user.rol)
  user: User;
}
