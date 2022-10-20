import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("finance")
export class Finance extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: string; //Identificador del cliente

  @Column({ type: "int4" })
  public totalIncome: number; //ingresos totales referenciados a ventas del restaurant.

  @Column({ type: "int4" })
  public totalExpenses: number; // Egresos totales del restaurant.

  @Column({ type: "varchar", length: 150, nullable: false })
  public purchaseDetail: string; //Detalle de compras del restaurant.

  @Column({
    type: "timestamp",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  public purchaseDate?: Date; //Fecha de compras del restaurant.

  @Column({ type: "varchar", length: 100, nullable: false })
  public userName: string; //Nombre del responsable de la caja
}
