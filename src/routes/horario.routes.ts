// src/routes/horario.routes.ts
import { Router } from "express";
import { HorarioController } from "../controllers/HorarioController";

const router = Router();
const ctrl = new HorarioController();
const wrap = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn.call(ctrl, req, res, next)).catch(next);

// Listar todas o filtrar por ?dia=Lunes
router.get("/horarios", wrap(ctrl.list));

// Obtener uno
router.get("/horarios/:id", wrap(ctrl.get));

// Crear
router.post("/horarios", wrap(ctrl.create));
router.post('/horarios/generar-default', wrap(ctrl.generarDefault));
// Actualizar
router.put("/horarios/:id", wrap(ctrl.update));

// Borrar
router.delete('/horarios/eliminar-todos', wrap(ctrl.eliminarTodos));
router.delete("/horarios/:id", wrap(ctrl.delete));






export default router;
