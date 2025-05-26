// src/services/ReservaService.ts
import { Repository } from "typeorm";
import { Reserva } from "../entities/Reserva";
import { AppDataSource } from "../data-source";
import { HorarioTaller } from "../entities/HorarioTaller"; // Asegúrate de importar la entidad HorarioTaller

export class ReservaService {
  private repo: Repository<Reserva>;
  private horarioRepo = AppDataSource.getRepository(HorarioTaller);

  constructor() {
    this.repo = AppDataSource.getRepository(Reserva);
    
  }
async listByFecha(fecha: string): Promise<Reserva[]> {
  // 1) Trae las reservas “normales” de esa fecha
  const normales = await this.repo.find({
    where: { fecha },
    relations: ["horario", "profesor"]
  });

  // 2) Trae todas las reservas marcadas como recurrentes
  const recurrentes = await this.repo.find({
    where: { es_recurrente: true },
    relations: ["horario", "profesor"]
  });

  // 3) Para cada recurrente, calculamos la fecha de esta semana
  const fechaObj = new Date(fecha);
  const diaSemanaMap: Record<string, number> = {
    "Lunes": 1, "Martes": 2, "Miércoles": 3,
    "Jueves": 4, "Viernes": 5
  };
  const lunes = new Date(fechaObj);
  lunes.setDate(fechaObj.getDate() - ((fechaObj.getDay() + 6) % 7)); // lunes de esa semana

  const clones = recurrentes.map(r => {
    const diaNum = diaSemanaMap[r.horario.dia_semana];
    const fechaClon = new Date(lunes);
    fechaClon.setDate(lunes.getDate() + (diaNum - 1));
    return {
      ...r,
      fecha: fechaClon.toISOString().slice(0, 10)
    } as Reserva;
  });

  // 4) Unimos normales + clones, evitando duplicados exactos (mismo id_horario y fecha)
  const key = (r: Reserva) => `${r.id_horario}|${r.fecha}`;
  const mapa = new Map<string, Reserva>();
  normales.forEach(r => mapa.set(key(r), r));
  clones.forEach(r => {
    if (!mapa.has(key(r))) mapa.set(key(r), r);
  });

  return Array.from(mapa.values());
}

   async create(data: {
  fecha: string;
  id_horario: number;
  id_profesor: number;
  es_recurrente?: boolean;
}): Promise<Reserva> {
  const horario = await this.horarioRepo.findOneBy({ id_horario: data.id_horario });
  if (!horario) throw new Error("Franja de horario no encontrada");

  const nueva = this.repo.create({
    fecha: data.fecha,
    id_horario: data.id_horario,
    id_profesor: data.id_profesor,
    hora_inicio: horario.hora_inicio,
    es_recurrente: data.es_recurrente ?? false
  });
  return this.repo.save(nueva);
}
 async marcarRecurrentesSemana(start: string, end: string): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .update(Reserva)
      .set({ es_recurrente: true })
      .where('fecha BETWEEN :start AND :end', { start, end })
      .execute();
  }


  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
