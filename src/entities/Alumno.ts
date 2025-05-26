import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Clase } from "./Clase";
import { AlumnoGrupo } from "./AlumnoGrupo";

@Entity("alumnos")
export class Alumno {
    @PrimaryGeneratedColumn()
    id_alumno!: number;

    @Column({ unique: true })
    numero_identificacion!: string;

    @Column()
    nombre!: string;

    @Column()
    apellido!: string;

    @ManyToOne(() => Clase, clase => clase.alumnos)
    @JoinColumn({ name: "id_clase" })
    clase!: Clase;

    // Nueva relación añadida
    @OneToMany(() => AlumnoGrupo, alumnoGrupo => alumnoGrupo.alumno)
    grupos!: AlumnoGrupo[];

    @Column({ 
        type: "timestamp", 
        default: () => "CURRENT_TIMESTAMP" 
    })
    created_at!: Date;
}