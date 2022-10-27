import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import bcrypt from "bcrypt";
import { Rol } from "./rol";

@Entity("user")
@Unique(["idUser"])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public idUser: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  public userName: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  public email: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  public phoneNumber: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  public password: string;

  @Column({ type: "int4", nullable: false })
  public fk_Rol: number;

  @OneToOne(() => Rol, (rol) => rol.idRol)
  @JoinColumn([{ name: "fk_Rol", referencedColumnName: "idRol" }])
  rol: Rol;

  static encryptPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };

  static comparePassword = async (
    password: string,
    receivedPassword: string
  ) => {
    return await bcrypt.compare(password, receivedPassword);
  };
}
