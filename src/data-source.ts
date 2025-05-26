import { GrupoTrabajo } from "./entities/GrupoTrabajo";
import { AlumnoGrupo } from "./entities/AlumnoGrupo";
import { Alumno } from "./entities/Alumno";
import { Clase } from "./entities/Clase";
import { Usuario } from "./entities/Usuario";
import { DataSource } from "typeorm";
import { CategoriaElemento } from "./entities/CategoriaElemento";
import { Elemento } from "./entities/Elemento";
import { Reserva } from "./entities/Reserva";
import { HorarioTaller } from "./entities/HorarioTaller";
import { Prestamo } from "./entities/Prestamo";
import { PrestamoElemento } from "./entities/PrestamoElemento";
import { Incidencia } from "./entities/Incidencia";
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT),
  username: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  synchronize: false,
  logging: true,
  entities: [
    Usuario,
    Alumno,
    Clase,
    GrupoTrabajo,
    AlumnoGrupo,
    CategoriaElemento,
    Elemento,
    Reserva,
    HorarioTaller,
    Prestamo,
    PrestamoElemento,
    Incidencia,
  ],
  migrations: [],
  subscribers: [],
});
