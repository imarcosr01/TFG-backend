import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from "typeorm";
import { GrupoTrabajo } from "./GrupoTrabajo";
import { Alumno } from "./Alumno";

@Entity("alumnos_grupo")
export class AlumnoGrupo {
    @PrimaryColumn()
    id_grupo: number;

    @PrimaryColumn()
    id_alumno: number;

    @ManyToOne(() => GrupoTrabajo, grupo => grupo.alumnosGrupo)
    @JoinColumn({ name: "id_grupo" })
    grupo!: GrupoTrabajo;

    @ManyToOne(() => Alumno, alumno => alumno.grupos)
    @JoinColumn({ name: "id_alumno" })
    alumno!: Alumno;
}