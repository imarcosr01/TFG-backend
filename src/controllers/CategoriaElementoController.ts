import { Request, Response, NextFunction } from "express";
import { CategoriaElementoService } from "../services/CategoriaElementoService";

export class CategoriaElementoController {
  private service = new CategoriaElementoService();

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const cats = await this.service.listAll();
      res.json(cats);
    } catch (err) {
      next(err);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const cat = await this.service.getById(+req.params.id);
      if (!cat) return res.status(404).json({ error: "No encontrada" });
      res.json(cat);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const nueva = await this.service.create(req.body);
      res.status(201).json(nueva);
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

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.service.delete(+req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

