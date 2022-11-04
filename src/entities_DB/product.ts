import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";

@Entity("product")
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int4" })
  public idProduct: number;

  @Column({ type: "int4" })
  public amount: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  public nameProduct: string;

  @Column({ type: "int4" })
  public availability: number;

  @Column({ type: "int4" })
  public price: number;

  @Column({ type: "int4", nullable: true })
  public fk_User: number;

  @ManyToOne(() => User, (user) => user.idUser)
  @JoinColumn([{ name: "fk_User", referencedColumnName: "idUser" }])
  user: User[];
}
