import { RequestHandler } from 'express';
import { AppDataSource } from '../data-source';
import { Alumno } from '../entities/Alumno';

export class AlumnoController {
  static getAlumnosPorClase: RequestHandler = async (req, res) => {
    const idClase = parseInt(req.params.idClase, 10);
    if (isNaN(idClase)) {
      res.status(400).json({ error: 'idClase inválido' });
      return;
    }
    try {
      const repo = AppDataSource.getRepository(Alumno);
      const alumnos = await repo.find({
        where: { clase: { id_clase: idClase } }
      });
      res.json(alumnos);
    } catch (error) {
      console.error('Error al obtener alumnos por clase:', error);
      res.status(500).json({ error: 'Error al obtener alumnos' });
    }
  }
}