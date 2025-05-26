import { Router, Request, Response, NextFunction } from "express";
import { CategoriaElementoController } from "../controllers/CategoriaElementoController";

const router = Router();
const ctrl = new CategoriaElementoController();
const wrap = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn.call(ctrl, req, res, next)).catch(next);

// Listar categorías
router.get("/categorias", wrap(ctrl.list));
// Obtener categoría por id
router.get("/categorias/:id", wrap(ctrl.get));
// Crear categoría
router.post("/categorias", wrap(ctrl.create));
// Actualizar categoría
router.put("/categorias/:id", wrap(ctrl.update));
// Borrar categoría
router.delete("/categorias/:id", wrap(ctrl.delete));

export default router;
