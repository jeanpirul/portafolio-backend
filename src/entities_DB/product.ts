import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

  @Column({ type: "varchar", length: 50, nullable: false })
  public username: string;
}
