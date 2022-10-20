import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("report")
export class Report extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int4" })
  public id: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  public reason: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  public status: string;
}
