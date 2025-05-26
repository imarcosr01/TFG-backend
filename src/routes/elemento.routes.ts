import { Router, Request, Response, NextFunction } from "express";
import { ElementoController } from "../controllers/ElementoController";

const router = Router();
const ctrl = new ElementoController();
const wrap = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn.call(ctrl, req, res, next)).catch(next);

// Listar / buscar elementos
router.get("/elementos", wrap(ctrl.list));
// Obtener uno concreto
router.get("/elementos/:id", wrap(ctrl.get));
// Crear nuevo elemento
router.post("/elementos", wrap(ctrl.create));
// Actualizar todos los datos de un elemento
router.put("/elementos/:id", wrap(ctrl.update));
// Ajustar stock (patch)
router.patch("/elementos/:id/stock", wrap(ctrl.adjustStock));
// Borrar elemento
router.delete("/elementos/:id", wrap(ctrl.delete));

router.get("/elementos/qr/:codigoQr", wrap(ctrl.getByCodigoQr));



export default router;
