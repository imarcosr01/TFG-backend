import { Request, Response } from "express";
import { PrestamoService } from "../services/PrestamoService";

const svc = new PrestamoService();

export class PrestamoController {
  async list(req: Request, res: Response) {
    const devuelto = req.query.devuelto !== undefined
      ? req.query.devuelto === 'true'
      : undefined;

    try {
      const items = await svc.listConDestino(devuelto);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async get(req: Request, res: Response) {
    const id = +req.params.id;
    const p = await svc.getById(id);
    if (!p) return res.status(404).json({ error: "No encontrado" });
    res.json(p);
  }

  async create(req: Request, res: Response) {
    try {
      const dto = req.body;
      const p = await svc.create(dto);
      res.status(201).json(p);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = +req.params.id;
      const p = await svc.update(id, req.body);
      res.json(p);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  async markReturned(req: Request, res: Response) {
    try {
      const id = +req.params.id;
      const p = await svc.markReturned(id);
      res.json(p);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  async delete(req: Request, res: Response) {
    await svc.delete(+req.params.id);
    res.status(204).send();
  }
}
