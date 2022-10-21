import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import bcrypt from "bcrypt";

@Entity("client")
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  public firstName: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  public lastName: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  public email: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  public phoneNumber: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  public password: string;

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
