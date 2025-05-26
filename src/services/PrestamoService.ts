import { AppDataSource } from "../data-source";
import { Prestamo } from "../entities/Prestamo";
import { PrestamoElemento } from "../entities/PrestamoElemento";
import { Repository } from "typeorm";


interface CrearPrestamoDTO {
  id_profesor: number;
  id_alumno?: number;
  id_grupo?: number;
  id_clase: number;
  elementos: { id_elemento: number; cantidad: number }[];
}

export class PrestamoService {
  private repo: Repository<Prestamo> = AppDataSource.getRepository(Prestamo);

  async listConDestino(devuelto?: boolean): Promise<any[]> {
    const qb = this.repo.createQueryBuilder("p")
      .leftJoinAndSelect("p.elementos", "pe")
      .leftJoinAndSelect("pe.elemento", "e")
      .leftJoinAndSelect("p.alumno", "alumno")
      .leftJoinAndSelect("p.grupo", "grupo");

    if (devuelto !== undefined) {
      qb.where("p.devuelto = :devuelto", { devuelto });
    }

    const prestamos = await qb.getMany();

    return prestamos.map(p => ({
      id: p.id_prestamo,
      fecha_prestamo: p.fecha_prestamo,
      fecha_devolucion: p.fecha_devolucion,
      devuelto: p.devuelto,
      destino: p.alumno
        ? `${p.alumno.nombre} ${p.alumno.apellido}`
        : p.grupo?.nombre || '—',
      elementos: p.elementos.map(pe => ({
        cantidad: pe.cantidad,
        elemento: {
          id: pe.elemento.id_elemento,
          nombre: pe.elemento.nombre
        }
      }))
    }));
  }

  async getById(id: number): Promise<Prestamo | null> {
    return this.repo.findOne({
      where: { id_prestamo: id },
      relations: ["elementos", "elementos.elemento", "alumno", "grupo"]
    });
  }

  async create(data: CrearPrestamoDTO): Promise<Prestamo> {
    const prestamo = new Prestamo();
    prestamo.id_clase = data.id_clase;
    prestamo.profesor = { id_usuario: data.id_profesor } as any;

    if (data.id_alumno) prestamo.alumno = { id_alumno: data.id_alumno } as any;
    if (data.id_grupo)  prestamo.grupo  = { id_grupo:  data.id_grupo  } as any;

    prestamo.elementos = data.elementos.map(el => {
      const pe = new PrestamoElemento();
      pe.id_elemento = el.id_elemento;
      pe.cantidad = el.cantidad;
      return pe;
    });

    return this.repo.save(prestamo);
  }

  async update(id: number, data: Partial<Prestamo>): Promise<Prestamo> {
    const p = await this.getById(id);
    if (!p) throw new Error("Préstamo no encontrado");
    Object.assign(p, data);
    return this.repo.save(p);
  }

  async markReturned(id: number): Promise<Prestamo> {
    const p = await this.getById(id);
    if (!p) throw new Error("Préstamo no encontrado");
    p.devuelto = true;
    return this.repo.save(p);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
