import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Telefone } from "./Telefone";

@Entity({ name: "Contato" })
export class Contato {
  @PrimaryGeneratedColumn()
  ID!: number;

  @Column()
  NOME?: string;

  @Column()
  IDADE?: number;

  @OneToMany(() => Telefone, (telefone) => telefone.contato, { cascade: true })
  telefones?: Telefone[];
}
