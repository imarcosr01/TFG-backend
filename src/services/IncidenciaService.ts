import { AppDataSource } from "../data-source";
import { Incidencia }   from "../entities/Incidencia";
import { Repository }    from "typeorm";

export class IncidenciaService {
  private repo: Repository<Incidencia>;

  constructor() {
    this.repo = AppDataSource.getRepository(Incidencia);
  }

  listAll(includeSolved = true): Promise<Incidencia[]> {
    // Si includeSolved=false, filtramos sólo no solucionadas
    const where = includeSolved ? {} : { solucionada: false };
    return this.repo.find({
      where,
      relations: ["profesor", "elemento", "clase"],
      order: { created_at: "DESC" }
    });
  }

  getById(id: number): Promise<Incidencia | null> {
    return this.repo.findOne({
      where: { id_incidencia: id },
      relations: ["profesor", "elemento", "clase"]
    });
  }
async create(data: {
  descripcion: string;
  id_profesor: number;
  id_elemento: number;
  id_clase: number;
}): Promise<Incidencia> {
  const inc = this.repo.create(data);
  return this.repo.save(inc);
}

  update(id: number, data: Partial<Incidencia>): Promise<Incidencia> {
    return this.repo.findOneBy({ id_incidencia: id }).then(existing => {
      if (!existing) throw new Error("Incidencia no encontrada");
      Object.assign(existing, data);
      return this.repo.save(existing);
    });
  }

  async markSolved(id: number): Promise<void> {
    await this.repo.update(id, { solucionada: true });
  }

  delete(id: number): Promise<void> {
    return this.repo.delete(id).then(() => {});
  }
}
