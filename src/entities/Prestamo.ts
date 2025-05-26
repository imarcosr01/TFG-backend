import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Alumno } from "./Alumno";
import { GrupoTrabajo } from "./GrupoTrabajo";
import { PrestamoElemento } from "./PrestamoElemento";

@Entity("prestamos")
export class Prestamo {
  @PrimaryGeneratedColumn({ name: "id_prestamo" })
  id_prestamo!: number;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  fecha_prestamo!: Date;

  @Column({ default: false })
  devuelto!: boolean;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "id_profesor" })
  profesor!: Usuario;

  @ManyToOne(() => Alumno, { nullable: true })
  @JoinColumn({ name: "id_alumno" })
  alumno?: Alumno;

  @ManyToOne(() => GrupoTrabajo, { nullable: true })
  @JoinColumn({ name: "id_grupo" })
  grupo?: GrupoTrabajo;

  @Column({ name: "id_clase" })
  id_clase!: number;

  @OneToMany(() => PrestamoElemento, pe => pe.prestamo, { cascade: true })
  elementos!: PrestamoElemento[];
  fecha_devolucion: any;
}
