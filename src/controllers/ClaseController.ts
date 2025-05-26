// src/controllers/ClaseController.ts
import { RequestHandler } from 'express';
import { AppDataSource } from '../data-source';
import { Clase } from '../entities/Clase';

export class ClaseController {
  static getAllClases: RequestHandler = async (req, res) => {
    try {
      const repo = AppDataSource.getRepository(Clase);
      const clases = await repo.find();
      res.json(clases);
    } catch (error) {
      console.error('Error al obtener clases:', error);
      res.status(500).json({ error: 'Error al obtener clases' });
    }
  }
}