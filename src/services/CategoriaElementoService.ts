import { AppDataSource } from "../data-source";
import { CategoriaElemento } from "../entities/CategoriaElemento";
import { Elemento } from "../entities/Elemento"; // Asegúrate de importar la entidad Elemento si la tienes creada

export class CategoriaElementoService {
  private repo = AppDataSource.getRepository(CategoriaElemento);
  
  private elementoRepo = AppDataSource.getRepository(Elemento);

  async listAll(): Promise<CategoriaElemento[]> {
    return this.repo.find({ relations: ["padre", "hijas"] });
  }

  async getById(id: number): Promise<CategoriaElemento> {
    const categoria = await this.repo.findOne({ where: { id }, relations: ["padre", "hijas"] });
    if (!categoria) throw new Error("Categoría no encontrada");
    return categoria;
  }

  async create(data: Partial<CategoriaElemento>): Promise<CategoriaElemento> {
    if (data.idPadre) {
      const parent = await this.repo.findOneBy({ id: data.idPadre });
      if (!parent) throw new Error("Categoría padre no encontrada");
    }
    const categoria = this.repo.create(data);
    return this.repo.save(categoria);
  }

  async update(id: number, data: Partial<CategoriaElemento>): Promise<CategoriaElemento> {
    const existing = await this.getById(id);
    if (data.idPadre && data.idPadre === id) throw new Error("No puede ser padre de sí misma");
    if (data.idPadre) {
      const parent = await this.repo.findOneBy({ id: data.idPadre });
      if (!parent) throw new Error("Categoría padre no encontrada");
    }
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    // Verificar si tiene subcategorías hijas
    const hijas = await this.repo.countBy({ idPadre: id });
    if (hijas > 0) {
      throw new Error('No se puede borrar: la categoría tiene subcategorías hijas.');
    }

    // Verificar si hay elementos asignados a esta categoría
    const elementos = await this.elementoRepo.countBy({ idCategoria: id });
    if (elementos > 0) {
      throw new Error('No se puede borrar: hay elementos asociados a esta categoría.');
    }

    // Si pasa las comprobaciones, eliminar
    await this.repo.delete(id);
  }
}