import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("report")
export class Report extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  reason: string;
  @Column()
  status: string;
}
