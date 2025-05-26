// src/services/HorarioService.ts
import { AppDataSource } from "../data-source";
import { HorarioTaller } from "../entities/HorarioTaller";
import { Repository } from "typeorm";

// Extraemos el tipo literal de los días
type DiaSemana = HorarioTaller["dia_semana"];

export class HorarioService {
  private repo: Repository<HorarioTaller>;

  constructor() {
    this.repo = AppDataSource.getRepository(HorarioTaller);
  }

  listAll(): Promise<HorarioTaller[]> {
    return this.repo.find({ order: { dia_semana: "ASC", hora_inicio: "ASC" } });
  }

  listByDia(dia: DiaSemana): Promise<HorarioTaller[]> {
    return this.repo.find({
      where: { dia_semana: dia },
      order: { hora_inicio: "ASC" }
    });
  }

  getById(id: number): Promise<HorarioTaller | null> {
    return this.repo.findOneBy({ id_horario: id });
  }

  /** Reemplaza aquí tu antigua función create */
  async create(data: {
    dia_semana: DiaSemana;
    hora_inicio: string;   // formato "HH:MM:SS"
  }): Promise<HorarioTaller> {
    const h = this.repo.create(data);   // crea la instancia
    return this.repo.save(h);           // la guarda y devuelve
  }

  async update(id: number, data: Partial<HorarioTaller>): Promise<HorarioTaller> {
    const existing = await this.repo.findOneBy({ id_horario: id });
    if (!existing) throw new Error("No encontrado");
    Object.assign(existing, data);
    return this.repo.save(existing);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
  async generarHorarioEstandar(): Promise<HorarioTaller[]> {
    const franjas = [
      "08:00:00", "08:55:00",
      "08:55:00", "09:50:00",
      "09:50:00", "10:45:00",
      "11:05:00", "12:00:00",
      "12:00:00", "12:55:00",
      "12:55:00", "13:50:00",
      "15:00:00", "15:55:00",
      "15:55:00", "16:50:00",
      "16:50:00", "17:45:00",
      "18:05:00", "19:00:00",
      "19:00:00", "19:55:00",
      "19:55:00", "20:50:00"
    ];

    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    const nuevos: HorarioTaller[] = [];

    for (const dia of dias) {
      for (let i = 0; i < franjas.length; i += 2) {
        const horario = this.repo.create({
          dia_semana: dia as DiaSemana,
          hora_inicio: franjas[i]
        });
        nuevos.push(horario);
      }
    }

    return this.repo.save(nuevos);
  }
 async eliminarTodosLosHorarios(): Promise<void> {
  await this.repo
    .createQueryBuilder()
    .delete()
    .execute();
}


}


