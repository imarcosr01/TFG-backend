// src/routes/alumno.routes.ts
import { Router } from 'express';
import { AlumnoController } from '../controllers/AlumnoController';

const router = Router();

// Listar alumnos de una clase específica
router.get('/alumnos/clase/:idClase', AlumnoController.getAlumnosPorClase);

export default router;
