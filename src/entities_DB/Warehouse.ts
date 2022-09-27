import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("warehouse")
export class Warehouse extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  address: string;
  @Column()
  quantity: number;
  @Column()
  idProd: string;
  @Column()
  idProv: string;
}
