import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity({ name: "action" })
export class Action extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int4" })
  public idAction?: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  public nameTableAction: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  public idTableAction: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  public idClient: string;

  @Column({
    type: "timestamp",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  public actionCreation?: Date;

  @Column({ type: "varchar", length: 100, nullable: false })
  public clientFirstName: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  public actionDetail: string;
}
