import "reflect-metadata";
import express from 'express';
import { AppDataSource } from './data-source';
import importRoutes from './routes/import.routes';
import path from 'path';
import cors from 'cors';
import grupoTrabajoRoutes from './routes/grupoTrabajo.routes';
import claseRoutes from "./routes/clase.routes";
import alumnoRoutes from './routes/alumno.routes';
import elementoRoutes from "./routes/elemento.routes";
import categoriaRoutes from "./routes/categoriaElemento.routes";
import { AuthController } from './controllers/AuthController';
import reservaRoutes from './routes/reserva.routes';
import horarioRoutes from "./routes/horario.routes";
import prestamoRoutes from './routes/prestamo.routes';
import incidenciaRoutes from "./routes/incidencia.routes";

import "dotenv/config"; // Carga las variables de entorno

console.log("[DEBUG] JWT Secret:", process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 3000;
const authCtrl = new AuthController();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Autenticación
app.post('/api/auth/login', authCtrl.login.bind(authCtrl));

// Import / Bulk routes
app.use('/api', importRoutes);

// Clases y alumnos por clase
app.use('/api', claseRoutes);
app.use('/api', alumnoRoutes);
app.use("/api", categoriaRoutes);
app.use("/api", elementoRoutes);
app.use('/api', reservaRoutes);
app.use('/api', grupoTrabajoRoutes);
app.use("/api", horarioRoutes);
app.use('/api', prestamoRoutes);
app.use('/api', incidenciaRoutes);

// Test
app.get('/api/test', (_, res) => {
  res.json({
    status: 'ok',
    message: 'API funcionando',
  });
});

// SPA fallback
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Inicializar DB y arrancar servidor
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Conectado a MySQL correctamente');
   app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en el puerto ${PORT}`);
});
  })
  .catch(error => {
    console.error('❌ Error de conexión a MySQL:', error);
    process.exit(1);
  });
