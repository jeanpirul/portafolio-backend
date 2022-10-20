import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("warehouse")
export class Warehouse extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int4" })
  public id: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  public address: string;

  @Column({ type: "int4" })
  public quantity: number;

  @Column({ type: "int4" })
  public idProd: number;

  @Column({ type: "int4" })
  public idProv: number;
}
