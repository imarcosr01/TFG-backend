// src/entities/Reserva.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn
} from "typeorm";
import { Usuario } from "./Usuario";
import { HorarioTaller } from "./HorarioTaller";

@Entity("reservas")
export class Reserva {
  @PrimaryGeneratedColumn({ name: "id_reserva" })
  id_reserva!: number;

  @Column({ type: "date" })
  fecha!: string;

  // ---------------------------------
  // Necesitamos capturar la hora de inicio de la franja
  @Column({ type: "time" })
  hora_inicio!: string;
  // ---------------------------------

  @ManyToOne(() => HorarioTaller, horario => horario.reservas)
  @JoinColumn({ name: "id_horario" })
  horario!: HorarioTaller;

  @Column({ name: "id_horario" })
  id_horario!: number;

  @ManyToOne(() => Usuario, usuario => usuario.reservas)
  @JoinColumn({ name: "id_profesor" })
  profesor!: Usuario;

  @Column({ name: "id_profesor" })
  id_profesor!: number;

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;

  @Column({ name: "es_recurrente", type: "boolean", default: false })
  es_recurrente!: boolean;
}
