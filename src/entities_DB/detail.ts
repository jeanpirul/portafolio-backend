import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("detail")
export class Detail extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int4" })
  public id: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  public address: string;

  @Column({ type: "int4" })
  public quantity: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  public idProd: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  public idProv: string;
}
