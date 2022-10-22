import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import bcrypt from "bcrypt";
import { Role } from "./roles";

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

  @Column({ type: "varchar", length: 100, nullable: true })
  public password: string;

  @Column({ type: "varchar", nullable: false, array: true })
  @OneToMany((type) => Role, (role) => role.nameRole)
  public nameRole: string[] | Role[];

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
