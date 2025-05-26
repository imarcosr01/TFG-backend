import * as XLSX from 'xlsx';
import { AppDataSource } from '../data-source';
import { Usuario } from '../entities/Usuario';
import { Alumno } from '../entities/Alumno';
import { Clase } from '../entities/Clase';
import bcrypt from 'bcryptjs';


interface ImportResult {
    success: number;
    errors: Array<{ row: any; error: string }>;
}

export class ExcelImportService {
    async importProfesores(fileBuffer: Buffer): Promise<ImportResult> {
    const workbook = XLSX.read(fileBuffer);
    const sheetName = Object.keys(workbook.Sheets).find(name => name.toLowerCase() === 'profesores');
    const worksheet = sheetName ? workbook.Sheets[sheetName] : undefined;
    const data: any[] = worksheet ? XLSX.utils.sheet_to_json(worksheet) : [];
    
    const results: ImportResult = { success: 0, errors: [] };
    const usuarioRepo = AppDataSource.getRepository(Usuario);

    for (const row of data) {
        try {
            const hashedPassword = await bcrypt.hash(row.password, 10);
            
            const profesor = usuarioRepo.create({
                email: row.email,
                password: hashedPassword,
                nombre: row.nombre,
                apellido: row.apellido,
                rol: row.rol?.toLowerCase() === 'administrador' ? 'administrador' : 'profesor'
            });

            await usuarioRepo.save(profesor);
            results.success++;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            results.errors.push({ 
                row, 
                error: errorMessage 
            });
        }
    }

    return results;
}

    async importAlumnos(fileBuffer: Buffer): Promise<ImportResult> {
    const workbook = XLSX.read(fileBuffer);
    const sheetName = Object.keys(workbook.Sheets).find(name => name.toLowerCase() === 'alumnos');
    const worksheet = sheetName ? workbook.Sheets[sheetName] : undefined;
    const data: any[] = worksheet ? XLSX.utils.sheet_to_json(worksheet) : [];
    
    const results: ImportResult = { success: 0, errors: [] };
    const alumnoRepo = AppDataSource.getRepository(Alumno);
    const claseRepo = AppDataSource.getRepository(Clase);

    for (const row of data) {
        try {
            let clase = await claseRepo.findOne({ where: { nombre: row.nombre_clase } });
            if (!clase) {
                clase = claseRepo.create({
                    nombre: row.nombre_clase,
                    curso_escolar: row.curso_escolar
                });
                await claseRepo.save(clase);
            }

            const alumno = alumnoRepo.create({
                numero_identificacion: row.numero_identificacion,
                nombre: row.nombre,
                apellido: row.apellido,
                clase: clase
            });

            await alumnoRepo.save(alumno);
            results.success++;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            results.errors.push({ 
                row, 
                error: errorMessage 
            });
        }
    }

    return results;
}
}