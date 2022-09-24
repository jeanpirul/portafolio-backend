import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("client", {
  synchronize: false,
})
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  email: string;
  @Column()
  phoneNumber: string;
  @Column({ nullable: true })
  password: string;
}
