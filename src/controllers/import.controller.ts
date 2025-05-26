import { Request, Response } from 'express';
import { ExcelImportService } from '../services/excelImport.service';
import fileUpload from 'express-fileupload';

export class ImportController {
    private excelService = new ExcelImportService();

    async importUsers(req: Request, res: Response): Promise<void> {
        try {
            if (!req.files || !req.files.file) {
                res.status(400).json({ error: 'No se subió ningún archivo' });
                return;
            }

            const file = req.files.file;
            if (Array.isArray(file)) {
                res.status(400).json({ error: 'Solo se permite un archivo' });
                return;
            }

            // Determinar el tipo de importación basado en parámetro o nombre de archivo
            const userType = req.body.userType || 
                           (file.name.includes('profesores') ? 'profesores' : 
                            file.name.includes('alumnos') ? 'alumnos' : null);

            if (!userType) {
                res.status(400).json({ error: 'No se especificó el tipo de usuario a importar' });
                return;
            }

            let result;
            if (userType === 'profesores') {
                result = await this.excelService.importProfesores(file.data);
            } else {
                result = await this.excelService.importAlumnos(file.data);
            }

            res.json({
                message: `Importación completada: ${result.success} ${userType} importados`,
                details: result.errors.length > 0 ? {
                    total_errors: result.errors.length,
                    first_errors: result.errors.slice(0, 5) // Mostrar solo primeros 5 errores
                } : null
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            res.status(500).json({ 
                error: 'Error en el servidor',
                details: errorMessage 
            });
        }
    }
}