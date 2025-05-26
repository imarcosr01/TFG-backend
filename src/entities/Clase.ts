import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Alumno } from "./Alumno";
import { GrupoTrabajo } from "./GrupoTrabajo";

@Entity("clases")
export class Clase {
    @PrimaryGeneratedColumn()
    id_clase!: number;

    @Column({ unique: true })
    nombre!: string;

    @Column({ type: 'char', length: 9 })
    curso_escolar!: string;

    // Relación con Alumnos (1 clase tiene muchos alumnos)
    @OneToMany(() => Alumno, alumno => alumno.clase)
    alumnos!: Alumno[];

    @Column({ 
        type: "timestamp", 
        default: () => "CURRENT_TIMESTAMP" 
    })
    created_at!: Date;
    
    @OneToMany(() => GrupoTrabajo, grupo => grupo.clase)
    grupos: GrupoTrabajo[];
}