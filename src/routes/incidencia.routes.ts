import { Router } from "express";
import { IncidenciaController } from "../controllers/IncidenciaController";

const router = Router();
const ctrl = new IncidenciaController();
const wrap = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn.call(ctrl, req, res, next)).catch(next);

// Listar (opcionalmente solo no resueltas: ?solved=false)
router.get("/incidencias", wrap(ctrl.list));

// Obtener una incidencia concreta
router.get("/incidencias/:id", wrap(ctrl.get));

// Crear
router.post("/incidencias", wrap(ctrl.create));

// Modificar
router.put("/incidencias/:id", wrap(ctrl.update));

// Marcar como resuelta
router.patch("/incidencias/:id/solve", wrap(ctrl.solve));

// Borrar
router.delete("/incidencias/:id", wrap(ctrl.delete));

export default router;
