import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Elemento } from "./Elemento";
import { Clase } from "./Clase";

@Entity("incidencias")
export class Incidencia {
  @PrimaryGeneratedColumn({ name: "id_incidencia" })
  id_incidencia!: number;

  @Column({ type: "text" })
  descripcion!: string;

  @Column({ type: "boolean", default: false })
  solucionada!: boolean;

  @Column({ name: "id_profesor" })
  id_profesor!: number;

  @Column({ name: "id_elemento" })
  id_elemento!: number;

  @Column({ name: "id_clase" })
  id_clase!: number;

  @ManyToOne(() => Usuario, usuario => usuario, { onDelete: "CASCADE" })
  @JoinColumn({ name: "id_profesor" })
  profesor!: Usuario;

  @ManyToOne(() => Elemento, elemento => elemento, { onDelete: "CASCADE" })
  @JoinColumn({ name: "id_elemento" })
  elemento!: Elemento;

  @ManyToOne(() => Clase, clase => clase, { onDelete: "CASCADE" })
  @JoinColumn({ name: "id_clase" })
  clase!: Clase;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
