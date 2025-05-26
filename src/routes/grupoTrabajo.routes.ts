import { Router, Request, Response, NextFunction } from 'express';
import { GrupoController } from '../controllers/grupo.controller';

const router = Router();
const ctrl = new GrupoController();

// Helper para manejar async errors
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => void;
const wrap = (fn: (req: Request, res: Response) => Promise<any>): AsyncHandler => {
  return (req, res, next) => fn(req, res).then(() => {}).catch(next);
};

// Profesores y alumnos globales
router.get('/usuarios/profesores', wrap(ctrl.getProfesores.bind(ctrl)));
router.get('/alumnos', wrap(ctrl.getAlumnos.bind(ctrl)));

// Grupos de trabajo
router.get('/grupos-trabajo/profesor/:idProfesor', wrap(ctrl.getGruposByProfesor.bind(ctrl)));
router.get('/grupos-trabajo/:id', wrap(ctrl.getGrupoById.bind(ctrl)));
router.post('/grupos-trabajo', wrap(ctrl.crearGrupo.bind(ctrl)));
router.put('/grupos-trabajo/:id', wrap(ctrl.actualizarGrupo.bind(ctrl)));
router.delete('/grupos-trabajo/:id', wrap(ctrl.eliminarGrupo.bind(ctrl)));

// Alumnos en un grupo
router.get('/grupos-trabajo/:idGrupo/alumnos', wrap(ctrl.getAlumnosGrupo.bind(ctrl)));
router.post('/grupos-trabajo/:idGrupo/alumnos', wrap(ctrl.asignarAlumnos.bind(ctrl)));
router.delete('/grupos-trabajo/:idGrupo/alumnos/:idAlumno', wrap(ctrl.eliminarAlumnoGrupo.bind(ctrl)));

export default router;
