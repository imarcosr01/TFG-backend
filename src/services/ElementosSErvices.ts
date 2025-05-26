import { AppDataSource } from "../data-source";
import { Elemento } from "../entities/Elemento";
import { CategoriaElemento } from "../entities/CategoriaElemento";

export class ElementoService {
  private repo = AppDataSource.getRepository(Elemento);
  private catRepo = AppDataSource.getRepository(CategoriaElemento);

  async listAll(): Promise<Elemento[]> {
    return this.repo.find({ relations: ["categoria"] });
  }

  async getById(id: number): Promise<Elemento> {
    const elemento = await this.repo.findOne({ where: { id }, relations: ["categoria"] });
    if (!elemento) throw new Error("Elemento no encontrado");
    return elemento;
  }

  async create(data: Partial<Elemento>): Promise<Elemento> {
    if (data.idCategoria) {
      const cat = await this.catRepo.findOneBy({ id: data.idCategoria });
      if (!cat) throw new Error("Categoría no encontrada");
    }
    const elemento = this.repo.create(data);
    return this.repo.save(elemento);
  }

  async update(id: number, data: Partial<Elemento>): Promise<Elemento> {
    const existing = await this.getById(id);
    if (data.idCategoria && data.idCategoria !== existing.idCategoria) {
      const cat = await this.catRepo.findOneBy({ id: data.idCategoria });
      if (!cat) throw new Error("Categoría no encontrada");
    }
    await this.repo.update(id, data);
    return this.getById(id);
  }
  async getByCodigoQr(codigoQr: string): Promise<Elemento | null> {
  return this.repo.findOne({
    where: { codigoQr },
    relations: ["categoria"]
  });
}

  async adjustStock(id: number, delta: number): Promise<Elemento> {
    const elemento = await this.getById(id);
    const newDisponible = elemento.stockDisponible + delta;
    if (newDisponible < 0) throw new Error("Stock insuficiente");
    elemento.stockDisponible = newDisponible;
    elemento.stockTotal += delta;
    return this.repo.save(elemento);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
