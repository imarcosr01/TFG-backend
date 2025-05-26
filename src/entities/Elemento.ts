import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { CategoriaElemento } from "./CategoriaElemento";

@Entity("elementos")
export class Elemento {
  @PrimaryGeneratedColumn({ name: "id_elemento" })
  id!: number;

  @Column({ name: "codigo_qr", type: "varchar", length: 100, unique: true })
  codigoQr!: string;

  @Column({ type: "varchar", length: 100 })
  nombre!: string;

  @Column({ type: "text", nullable: true })
  descripcion?: string;

  @Column({ name: "stock_total", type: "int", default: 0 })
  stockTotal!: number;

  @Column({ name: "stock_disponible", type: "int", default: 0 })
  stockDisponible!: number;

  @Column({ name: "id_categoria" })
  idCategoria!: number;

  @ManyToOne(() => CategoriaElemento, cat => cat.elementos, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: "id_categoria" })
  categoria!: CategoriaElemento;

  @Column({ type: "boolean", default: true })
  activo!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
  id_elemento: any;
}
