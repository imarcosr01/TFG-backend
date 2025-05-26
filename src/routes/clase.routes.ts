// src/routes/clase.routes.ts
import { Router } from 'express';
import { ClaseController } from '../controllers/ClaseController';

const router = Router();

// Listar todas las clases
router.get('/clases', ClaseController.getAllClases);

export default router;
