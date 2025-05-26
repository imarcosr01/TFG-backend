// src/controllers/ReservaController.ts

import { Request, Response, NextFunction } from "express";
import { ReservaService } from "../services/ReservaService";


export class ReservaController {
  private service = new ReservaService();

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const fecha = req.query.fecha as string;
      if (!fecha) return res.status(400).json({ error: "Fecha requerida" });
      const reservas = await this.service.listByFecha(fecha);
      res.json(reservas);
    } catch (err) {
      next(err);
    }
  }

 async create(req: Request, res: Response) {
  const { fecha, id_horario, id_profesor, es_recurrente } = req.body;
  if (!fecha || !id_horario || !id_profesor) {
    return res.status(400).json({ error: "Datos incompletos" });
  }
  const nueva = await this.service.create({ fecha, id_horario, id_profesor, es_recurrente });
  return res.status(201).json(nueva);
}
  async marcarRecurrentes(req: Request, res: Response, next: NextFunction) {
    try {
      const fecha = req.query.fecha as string;
      if (!fecha) {
        return res.status(400).json({ error: 'Fecha requerida como YYYY-MM-DD' });
      }

      // 1) Parseamos la fecha (YYYY-MM-DD)
      const [y, m, d] = fecha.split('-').map(s => parseInt(s, 10));
      const dateObj = new Date(y, m - 1, d);

      // 2) Calculamos el lunes de esa semana (lunes = 1)
      const day = dateObj.getDay();                  // domingo=0, lunes=1...
      const diffToMonday = (day + 6) % 7;             // convierte domingo(0)->6, lunes(1)->0, etc.
      const monday = new Date(dateObj);
      monday.setDate(dateObj.getDate() - diffToMonday);

      // 3) Calculamos el viernes (lunes + 4 días)
      const friday = new Date(monday);
      friday.setDate(monday.getDate() + 4);

      // 4) Formateamos a 'YYYY-MM-DD'
      const pad = (n: number) => n.toString().padStart(2, '0');
      const startStr = `${monday.getFullYear()}-${pad(monday.getMonth()+1)}-${pad(monday.getDate())}`;
      const endStr   = `${friday .getFullYear()}-${pad(friday .getMonth()+1)}-${pad(friday .getDate())}`;

      // 5) Marcamos esas reservas como recurrentes
      await this.service.marcarRecurrentesSemana(startStr, endStr);

      return res.status(200).json({ message: 'Reservas marcadas como recurrentes' });
    } catch (err) {
      next(err);
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
