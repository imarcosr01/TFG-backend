// src/controllers/AuthController.ts
import { RequestHandler } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ error: "Email y contraseña son obligatorios" });
      return;
    }

    try {
      const { token, user } = await this.authService.login(email, password);
      
      // Retorno explícito como any para evitar conflicto de tipos
      return res.json({ 
        token,
        user: {
          id: user.id_usuario,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          rol: user.rol
        }
      }) as any;
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error de autenticación";
      res.status(401).json({ error: message });
      return;
    }
  };
}