// src/routes/reserva.routes.ts
import { Router } from "express";
import { ReservaController } from "../controllers/ReservaController";

const router = Router();
const ctrl = new ReservaController();

// Helper para manejar async errors
const wrap = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn.call(ctrl, req, res, next)).catch(next);

// Listar reservas por fecha
router.get('/reservas', wrap(ctrl.list));

// Crear reserva
router.post('/reservas', wrap(ctrl.create));

// Borrar reserva
router.delete('/reservas/:id', wrap(ctrl.delete));
router.post(
  '/reservas/marcar-recurrentes',
  wrap(ctrl.marcarRecurrentes)
);

export default router;
