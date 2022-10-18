import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("product")
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  idProduct: string;
  @Column()
  amount: number;
  @Column()
  nameProduct: string;
  @Column()
  availability: number;
  @Column()
  price: number;
  @Column()
  username: string;
}
