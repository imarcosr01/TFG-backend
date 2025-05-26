// src/controllers/GrupoController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/Usuario";
import { Alumno } from "../entities/Alumno";
import { GrupoTrabajo } from "../entities/GrupoTrabajo";
import { AlumnoGrupo } from "../entities/AlumnoGrupo";
import { Clase } from "../entities/Clase";

export class GrupoController {
  // Obtener lista de profesores
  async getProfesores(_: Request, res: Response): Promise<Response<any, any>> {
    try {
      const repo = AppDataSource.getRepository(Usuario);
      const profesores = await repo.find({
        where: { rol: 'profesor' },
        select: ['id_usuario', 'nombre', 'apellido']
      });
      const formateados = profesores.map(p => ({
        id_usuario: p.id_usuario,
        nombre: `${p.nombre} ${p.apellido}`
      }));
      return res.json(formateados);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener profesores' });
    }
  }

  // Obtener lista de alumnos
  async getAlumnos(_: Request, res: Response): Promise<Response<any, any>> {
    try {
      const repo = AppDataSource.getRepository(Alumno);
      const alumnos = await repo.find({
        select: ['id_alumno', 'nombre', 'apellido']
      });
      return res.json(alumnos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener alumnos' });
    }
  }

  // Obtener todos los grupos de un profesor
  async getGruposByProfesor(req: Request, res: Response): Promise<Response<any, any>> {
    try {
        const idProfesor = parseInt(req.params.idProfesor, 10);
        const repo = AppDataSource.getRepository(GrupoTrabajo);
        const grupos = await repo.find({
            where: { profesor: { id_usuario: idProfesor } },
            relations: ['clase', 'profesor', 'alumnosGrupo']
        });
        return res.json(grupos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener grupos del profesor' });
    }
}

  // Obtener un solo grupo por ID
  async getGrupoById(req: Request, res: Response): Promise<Response<any, any>> {
    try {
      const idGrupo = parseInt(req.params.id, 10);
      const repo = AppDataSource.getRepository(GrupoTrabajo);
      const grupo = await repo.findOne({
        where: { id_grupo: idGrupo },
        relations: ['clase', 'profesor', 'alumnoGrupos', 'alumnoGrupos.alumno']
      });
      if (!grupo) {
        return res.status(404).json({ error: 'Grupo no encontrado' });
      }
      return res.json(grupo);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener el grupo' });
    }
  }

  // Crear grupo + asignar alumnos en transacción
  async crearGrupo(req: Request, res: Response): Promise<Response<any, any>> {
    const qr = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const { nombre, id_clase, id_profesor, alumnos } = req.body;
      if (!nombre || !id_clase || !id_profesor) {
        throw new Error('Nombre, clase y profesor son obligatorios');
      }

      const claseExists = await qr.manager.count(Clase, { where: { id_clase } });
      if (!claseExists) throw new Error('Clase no existe');
      const profExists = await qr.manager.count(Usuario, { where: { id_usuario: id_profesor, rol: 'profesor' } });
      if (!profExists) throw new Error('Profesor no válido');

      const grupoRepo = qr.manager.getRepository(GrupoTrabajo);
      const newGrupo = grupoRepo.create({
        nombre,
        clase: { id_clase },
        profesor: { id_usuario: id_profesor }
      });
      const savedGrupo = await grupoRepo.save(newGrupo);

      if (Array.isArray(alumnos)) {
        const agRepo = qr.manager.getRepository(AlumnoGrupo);
        const items = alumnos.map((id: number) =>
          agRepo.create({ grupo: { id_grupo: savedGrupo.id_grupo }, alumno: { id_alumno: id } })
        );
        await agRepo.save(items);
      }

      await qr.commitTransaction();
      return res.status(201).json(savedGrupo);
    } catch (error) {
      await qr.rollbackTransaction();
      console.error(error);
      return res.status(500).json({ error: 'Error al crear grupo', mensaje: (error as Error).message });
    } finally {
      await qr.release();
    }
  }

  // Actualizar grupo (datos básicos)
  async actualizarGrupo(req: Request, res: Response): Promise<Response<any, any>> {
    try {
      const idGrupo = parseInt(req.params.id, 10);
      const { nombre, id_clase, id_profesor } = req.body;
      const repo = AppDataSource.getRepository(GrupoTrabajo);
      const grupo = await repo.findOneBy({ id_grupo: idGrupo });
      if (!grupo) {
        return res.status(404).json({ error: 'Grupo no encontrado' });
      }

      grupo.nombre = nombre;
      grupo.clase = { id_clase } as any;
      grupo.profesor = { id_usuario: id_profesor } as any;
      const updated = await repo.save(grupo);
      return res.json(updated);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al actualizar grupo' });
    }
  }

  // Eliminar grupo y sus relaciones
  async eliminarGrupo(req: Request, res: Response): Promise<Response<any, any>> {
    try {
      const idGrupo = parseInt(req.params.id, 10);
      const agRepo = AppDataSource.getRepository(AlumnoGrupo);
      await agRepo.delete({ id_grupo: idGrupo });
      const gRepo = AppDataSource.getRepository(GrupoTrabajo);
      const result = await gRepo.delete({ id_grupo: idGrupo });
      if (result.affected === 0) {
        return res.status(404).json({ error: 'Grupo no encontrado' });
      }
      return res.json({ mensaje: 'Eliminado correctamente' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al eliminar grupo' });
    }
  }

  // Obtener alumnos de un grupo
 async getAlumnosGrupo(req: Request, res: Response): Promise<Response<any, any>> {
    try {
        const idGrupo = parseInt(req.params.idGrupo, 10);
        const agRepo = AppDataSource.getRepository(AlumnoGrupo);
        const relaciones = await agRepo.find({
            where: { grupo: { id_grupo: idGrupo } },
            relations: ['alumno']
        });
        const alumnos = relaciones.map(r => r.alumno);
        return res.json(alumnos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener alumnos del grupo' });
    }
}

  // Eliminar un alumno de un grupo
  async eliminarAlumnoGrupo(req: Request, res: Response): Promise<Response<any, any>> {
    try {
      const idGrupo = parseInt(req.params.idGrupo, 10);
      const idAlumno = parseInt(req.params.idAlumno, 10);
      const agRepo = AppDataSource.getRepository(AlumnoGrupo);
      const result = await agRepo.delete({ id_grupo: idGrupo, id_alumno: idAlumno });
      if (result.affected === 0) {
        return res.status(404).json({ error: 'Relación no encontrada' });
      }
      return res.json({ mensaje: 'Alumno eliminado del grupo' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al eliminar alumno del grupo' });
    }
  }

  // Asignar nuevos alumnos a un grupo existente
  async asignarAlumnos(req: Request, res: Response): Promise<Response<any, any>> {
    try {
      const idGrupo = parseInt(req.params.idGrupo, 10);
      const alumnos: number[] = req.body.alumnos;
      if (!Array.isArray(alumnos)) {
        return res.status(400).json({ error: 'Se espera array de IDs de alumnos' });
      }
      const agRepo = AppDataSource.getRepository(AlumnoGrupo);
      const items = alumnos.map(id => 
        agRepo.create({ grupo: { id_grupo: idGrupo }, alumno: { id_alumno: id } })
      );
      await agRepo.save(items);
      return res.status(201).json({ mensaje: 'Alumnos asignados' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al asignar alumnos' });
    }
  }
}
