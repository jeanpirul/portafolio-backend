import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("client")
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int4" })
  public id: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  public firstName: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  public lastName: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  public email: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  public phoneNumber: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  public password: string;
}
