import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Contato } from "./Contato";

@Entity({ name: "Telefone" })
export class Telefone {
  @PrimaryGeneratedColumn()
  ID!: number;

  @Column()
  NUMERO: string;

  @ManyToOne(() => Contato, (contato) => contato.telefones)
  contato: Contato;

  constructor(NUMERO: string, contato: Contato) {
    this.NUMERO = NUMERO;
    this.contato = contato;
  }
}
