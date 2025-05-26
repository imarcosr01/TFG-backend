import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id_usuario: number;
    role: "profesor" | "administrador"; // Coherente con la entidad Usuario
  };
}

export function authGuard(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "UN_SECRETO_MUY_SEGURO"
    ) as any; // Considera usar una interfaz para el payload

    // Corregir aquí: usa "rol" en lugar de "role"
    req.user = {
      id_usuario: payload.sub,
      role: payload.rol // <-- ¡Clave corregida!
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}