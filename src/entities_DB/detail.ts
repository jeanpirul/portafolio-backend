import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("detail")
export class Detail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  address: string;
  @Column()
  quantity: number;
  @Column()
  id_prod: string;
  @Column()
  id_prov: string;
}
