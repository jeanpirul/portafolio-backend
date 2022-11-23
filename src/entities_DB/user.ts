import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import bcrypt from "bcrypt";
import { Rol } from "./rol";
import { Product } from "./product";
import { Finance } from "./finance";

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public idUser: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public userName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public phoneNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public password: string;

  @Column({ type: 'int4', nullable: true })
  public fk_Rol: number;

  @ManyToOne(() => Rol, (rol) => rol.idRol)
  @JoinColumn([{ name: 'fk_Rol', referencedColumnName: 'idRol' }])
  rol: Rol[];

  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  @OneToMany(() => Finance, (finance) => finance.user)
  finance: Finance;

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
