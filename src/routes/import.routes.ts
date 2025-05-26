import { Router } from 'express';
import { ImportController } from '../controllers/import.controller';
import fileUpload from 'express-fileupload';


const router = Router();
const controller = new ImportController();

const uploadOptions = {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    abortOnLimit: true,
    createParentPath: true,
    useTempFiles: false
};

router.post('/import/users', 
    fileUpload(uploadOptions),
    (req, res, next) => {
        controller.importUsers(req, res).catch(next);
    }
);

export default router;