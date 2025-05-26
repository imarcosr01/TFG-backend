// src/entities/Usuario.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { GrupoTrabajo } from "./GrupoTrabajo";
import { Reserva } from "./Reserva";  // <- Importa Reserva

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn({ name: "id_usuario", type: "int" })
  id_usuario!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ name: "password" })
  password!: string;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column({
    type: "enum",
    enum: ["administrador", "profesor"]
  })
  rol!: "administrador" | "profesor";

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP"
  })
  created_at!: Date;

  @OneToMany(() => GrupoTrabajo, grupo => grupo.profesor)
  grupos!: GrupoTrabajo[];

  // >>> Añade esta relación inversa:
  @OneToMany(() => Reserva, reserva => reserva.profesor)
  reservas!: Reserva[];
}
