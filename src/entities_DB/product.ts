import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("product")
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int4" })
  public idProd: number;

  @Column({ type: "int4" })
  public idBodega: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  public availability: string;

  @Column({ type: "int4" })
  public price: number;
}
