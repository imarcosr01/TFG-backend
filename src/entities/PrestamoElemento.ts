import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Prestamo } from "./Prestamo";
import { Elemento } from "./Elemento";

@Entity("prestamos_elementos")
export class PrestamoElemento {
  @PrimaryColumn()
  id_prestamo!: number;

  @PrimaryColumn()
  id_elemento!: number;

  @Column()
  cantidad!: number;

  @ManyToOne(() => Prestamo, p => p.elementos)
  @JoinColumn({ name: "id_prestamo" })
  prestamo!: Prestamo;

  @ManyToOne(() => Elemento)
  @JoinColumn({ name: "id_elemento" })
  elemento!: Elemento;
}
