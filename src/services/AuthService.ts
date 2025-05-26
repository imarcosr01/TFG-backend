// src/services/AuthService.ts
import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/Usuario";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
  private repo = AppDataSource.getRepository(Usuario);
  private jwtSecret = process.env.JWT_SECRET || "UN_SECRETO_MUY_SEGURO";
async validateUser(email: string, plainPassword: string) {
  // 1. Log para verificar parámetros de entrada
  console.log("[DEBUG] Email recibido:", email);
  console.log("[DEBUG] Contraseña recibida:", plainPassword);

  const user = await this.repo
    .createQueryBuilder("usuario")
    .addSelect("usuario.password")
    .where("usuario.email = :email", { email })
    .getOne();

  // 2. Log del usuario encontrado (incluyendo el hash)
  console.log("[DEBUG] Usuario encontrado en BD:", user);

  if (!user) return null;
  
  // 3. Log de la comparación de contraseñas
  console.log("[DEBUG] Comparando contraseña...");
  const valid = await bcrypt.compare(plainPassword, user.password);
  console.log("[DEBUG] Resultado de bcrypt.compare:", valid);

  return valid ? user : null;
}
async login(email: string, plainPassword: string) {
  const user = await this.validateUser(email, plainPassword);
  if (!user) throw new Error("Credenciales inválidas");

  // Corregir nombre de propiedad 'rol'
  const payload = { 
    sub: user.id_usuario, 
    rol: user.rol // <-- Ahora coincide con la entidad
  };

  const token = jwt.sign(payload, this.jwtSecret, { expiresIn: "8h" });
  return { token, user };
}}
