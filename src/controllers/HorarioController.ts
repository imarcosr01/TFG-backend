// src/controllers/HorarioController.ts
import { Request, Response, NextFunction } from "express";
import { HorarioService } from "../services/HorarioService";
import { HorarioTaller } from "../entities/HorarioTaller";

// Extraemos el literal de los días de la entidad
type DiaSemana = HorarioTaller["dia_semana"];
const DIAS_VALIDOS: DiaSemana[] = ["Lunes","Martes","Miércoles","Jueves","Viernes"];

export class HorarioController {
  private service = new HorarioService();

  /** GET /api/horarios?dia=Martes */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const dia = req.query.dia as string | undefined;
      let items;
      if (dia) {
        if (!DIAS_VALIDOS.includes(dia as DiaSemana)) {
          return res.status(400).json({ error: `Día inválido: ${dia}` });
        }
        items = await this.service.listByDia(dia as DiaSemana);
      } else {
        items = await this.service.listAll();
      }
      return res.json(items);
    } catch (err) {
      next(err);
    }
  }

  /** GET /api/horarios/:id */
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;
      const item = await this.service.getById(id);
      if (!item) {
        return res.status(404).json({ error: "Horario no encontrado" });
      }
      return res.json(item);
    } catch (err) {
      next(err);
    }
  }

  /** POST /api/horarios */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { dia_semana, hora_inicio } = req.body as {
        dia_semana: string;
        hora_inicio: string;
      };

      // Validación mínima
      if (!dia_semana || !hora_inicio) {
        return res.status(400).json({ error: "Datos incompletos" });
      }
      if (!DIAS_VALIDOS.includes(dia_semana as DiaSemana)) {
        return res.status(400).json({ error: `Día inválido: ${dia_semana}` });
      }

      const nueva = await this.service.create({
        dia_semana: dia_semana as DiaSemana,
        hora_inicio,
       
      });
      return res.status(201).json(nueva);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  /** PUT /api/horarios/:id */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;
      const body = req.body as Partial<HorarioTaller>;

      // Si envían un nuevo dia_semana, validamos
      if (body.dia_semana && !DIAS_VALIDOS.includes(body.dia_semana)) {
        return res.status(400).json({ error: `Día inválido: ${body.dia_semana}` });
      }

      const updated = await this.service.update(id, body);
      return res.json(updated);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  /** DELETE /api/horarios/:id */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;
      await this.service.delete(id);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
   async generarDefault(req: Request, res: Response) {
  try {
    await this.service.generarHorarioEstandar();
    return res.status(201).json({ message: 'Horario estándar generado correctamente.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
async eliminarTodos(req: Request, res: Response) {
  try {
    await this.service.eliminarTodosLosHorarios(); // Llama al método del service
    return res.status(200).json({ message: 'Todos los horarios han sido eliminados correctamente.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
}
