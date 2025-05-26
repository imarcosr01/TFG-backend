import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne,JoinColumn } from "typeorm";
import { AlumnoGrupo } from "./AlumnoGrupo";
import { Usuario } from "./Usuario";
import { Clase } from "./Clase";

@Entity("grupos_trabajo")
export class GrupoTrabajo {
    @PrimaryGeneratedColumn()
    id_grupo!: number;

    @Column()
    nombre!: string;

    @ManyToOne(() => Clase, clase => clase.grupos)
    @JoinColumn({ name: "id_clase" })
    clase!: Clase;

    @ManyToOne(() => Usuario, profesor => profesor.grupos)
    @JoinColumn({ name: "id_profesor" })
    profesor!: Usuario;

    @OneToMany(() => AlumnoGrupo, ag => ag.grupo)
    alumnosGrupo!: AlumnoGrupo[];
}