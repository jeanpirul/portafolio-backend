import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
// Proveedor
@Entity("supplier")
export class Supplier extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int4" })
  public id: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  public name: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  public contact: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  public supplierType: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  public productType: string;
}
