import { Router } from "express";
import { PrestamoController } from "../controllers/PrestamoController";

const router = Router();
const ctrl = new PrestamoController();
const wrap = (fn: Function) => (req:any,res:any,next:any)=>Promise.resolve(fn.call(ctrl,req,res,next)).catch(next);

router.get('/prestamos', wrap(ctrl.list));               // ?devuelto=true/false
router.get('/prestamos/:id', wrap(ctrl.get));
router.post('/prestamos', wrap(ctrl.create));
router.put('/prestamos/:id', wrap(ctrl.update));
router.patch('/prestamos/:id/return', wrap(ctrl.markReturned));
router.delete('/prestamos/:id', wrap(ctrl.delete));

export default router;