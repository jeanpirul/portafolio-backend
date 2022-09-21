import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("finance")
export class Finance extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string; //Identificador del cliente
  @Column()
  totalIncome: number; //ingresos totales referenciados a ventas del restaurant.
  @Column()
  totalExpenses: number; // Egresos totales del restaurant.
  @Column({ nullable: true })
  purchaseDate: Date; //Fecha de compras del restaurant.
  @Column()
  purchaseDetail: string; //Detalle de compras del restaurant.
}
