"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Middleware para habilitar CORS
const app = (0, express_1.default)();
const PORT = 3000;
// Middlewares
app.use((0, cors_1.default)()); // Permite peticiones desde cualquier origen (CORS)
app.use(express_1.default.json()); // Para parsear el body de las peticiones a JSON
// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Backend funcionando con TypeScript!');
});
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
