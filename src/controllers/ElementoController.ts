import { Request, Response, NextFunction } from "express";
import { ElementoService } from "../services/ElementosSErvices";

export class ElementoController {
  private service = new ElementoService();

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const elementos = await this.service.listAll();
      res.json(elementos);
    } catch (err) {
      next(err);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const elemento = await this.service.getById(+req.params.id);
      if (!elemento) return res.status(404).json({ error: "No encontrado" });
      res.json(elemento);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const nuevo = await this.service.create(req.body);
      res.status(201).json(nuevo);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await this.service.update(+req.params.id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
  

  async adjustStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { delta } = req.body;
      const elem = await this.service.adjustStock(+req.params.id, delta);
      res.json(elem);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.service.delete(+req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
   async getByCodigoQr(req: Request, res: Response) {
    const codigo = req.params.codigoQr;
    const elemento = await this.service.getByCodigoQr(codigo);
    if (!elemento) return res.status(404).json({ error: 'Elemento no encontrado' });
    res.json(elemento);
  }
}
