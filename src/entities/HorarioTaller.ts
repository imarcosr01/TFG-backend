// src/entities/HorarioTaller.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToMany, CreateDateColumn
} from "typeorm";
import { Reserva } from "./Reserva";

@Entity("horarios_taller")
export class HorarioTaller {
  @PrimaryGeneratedColumn({ name: "id_horario" })
  id_horario!: number;

  @Column({
    type: "enum",
    enum: ["Lunes","Martes","Miércoles","Jueves","Viernes"]
  })
  dia_semana!: "Lunes"|"Martes"|"Miércoles"|"Jueves"|"Viernes";

  @Column({ type: "time", name: "hora_inicio" })
  hora_inicio!: string;

  @Column({
    type: "time",
    name: "hora_fin",
    generatedType: "STORED",
    asExpression: `ADDTIME(hora_inicio,'00:55:00')`
  })
  hora_fin!: string;

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;

  @OneToMany(() => Reserva, reserva => reserva.horario)
  reservas!: Reserva[];
}
