import { Request, Response, NextFunction } from "express";
import { IncidenciaService } from "../services/IncidenciaService";

export class IncidenciaController {
  private service = new IncidenciaService();

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const includeSolved = req.query.solved === "true" ? true : req.query.solved === "false" ? false : true;
      const items = await this.service.listAll(includeSolved);
      res.json(items);
    } catch (err) {
      next(err);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;
      const inc = await this.service.getById(id);
      if (!inc) return res.status(404).json({ error: "No encontrada" });
      res.json(inc);
    } catch (err) {
      next(err);
    }
  }

 async create(req: Request, res: Response) {
  try {
    const { descripcion, id_profesor, id_elemento, id_clase } = req.body;
    if (!descripcion || !id_profesor || !id_elemento || !id_clase) {
      return res.status(400).json({ error: "Datos incompletos" });
    }
    const nueva = await this.service.create({
      descripcion,
      id_profesor,
      id_elemento,
      id_clase
    });
    res.status(201).json(nueva);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;
      const updated = await this.service.update(id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async solve(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;
      await this.service.markSolved(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;
      await this.service.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
