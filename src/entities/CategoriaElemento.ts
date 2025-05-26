// src/entities/CategoriaElemento.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from "typeorm";
import { Elemento } from "./Elemento";
@Entity("categorias_elementos")
export class CategoriaElemento {
  @PrimaryGeneratedColumn({ name: "id_categoria" })
  id!: number;

  @Column({ type: "varchar", length: 100, unique: true })
  nombre!: string;

  @Column({ name: "id_padre", nullable: true })
  idPadre?: number;

  @ManyToOne(() => CategoriaElemento, categoria => categoria.hijas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "id_padre" })
  padre?: CategoriaElemento;

  @OneToMany(() => CategoriaElemento, categoria => categoria.padre)
  hijas!: CategoriaElemento[];

  @OneToMany(() => Elemento, elemento => elemento.categoria)
  elementos!: Elemento[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}