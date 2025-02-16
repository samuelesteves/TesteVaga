import { Request, Response } from "express";
import * as cache from "memory-cache";
import { AppDataSource } from "../data-source";
import { Contato } from "../entity/Contato";

export class ContatoController {
  static async getById(id: number): Promise<Contato | null> {
    const contatoRepository = AppDataSource.getRepository(Contato);

    return await contatoRepository
      .createQueryBuilder("contato")
      .where("contato.ID = :id", { id })
      .getOne();
  }

  static validateId(id: string): boolean {
    const idNumber = Number(id);
    return !isNaN(idNumber);
  }

  static validateFields(NOME: string, IDADE: number): boolean {
    if (!NOME || !IDADE) return false;
    return !(NOME.length > 100 || IDADE > 120);
  }

  static async getAllContatos(req: Request, res: Response) {
    const data = cache.get("data");
    if (data) {
      console.log("get from cache");
      return res.status(200).json({
        data,
      });
    } else {
      console.log("get from database");
      const contatoRepository = AppDataSource.getRepository(Contato);
      const contatos = await contatoRepository.find({
        relations: ["telefones"],
      });
      cache.put("data", contatos, 10000);
      return res.status(200).json({
        data: contatos,
      });
    }
  }

  static async getContatoById(req: Request, res: Response) {
    const { id } = req.params;

    if (!ContatoController.validateId(id)) {
      return res
        .status(400)
        .json({ message: "ID inválido, deve ser um número" });
    }

    const idNumber = Number(id);
    const contatoRepository = AppDataSource.getRepository(Contato);
    const contato = await contatoRepository.findOne({
      where: { ID: idNumber },
      relations: ["telefones"],
    });

    if (!contato) {
      return res.status(404).json({ message: "Contato não encontrado" });
    }

    return res.status(200).json(contato);
  }

  static async createContato(req: Request, res: Response) {
    const contato = new Contato();

    if (!ContatoController.validateFields(req.body.NOME, req.body.IDADE)) {
      return res.status(400).json({ message: "Nome ou idade inválidos." });
    }

    contato.NOME = req.body.NOME;
    contato.IDADE = req.body.IDADE;
    contato.telefones = req.body.telefones;

    const contatoRepository = AppDataSource.getRepository(Contato);
    await contatoRepository.save(contato);

    cache.del("data");

    return res
      .status(200)
      .json({ message: "Contato criado com sucesso", contato });
  }
  static async updateContato(req: Request, res: Response) {
    const { id } = req.params;

    if (!ContatoController.validateId(id)) {
      return res
        .status(400)
        .json({ message: "ID inválido, deve ser um número" });
    }

    if (!ContatoController.validateFields(req.body.NOME, req.body.IDADE)) {
      return res.status(400).json({ message: "Nome ou idade inválidos." });
    }

    const idNumber = Number(id);
    const contato = await ContatoController.getById(idNumber);
    const contatoRepository = AppDataSource.getRepository(Contato);

    if (!contato) {
      return res.status(404).json({ message: "Contato não encontrado" });
    }

    Object.assign(contato, req.body);
    await contatoRepository.save(contato);

    cache.del("data");

    return res.status(200).json({
      message: "Contato atualizado com sucesso",
      contato,
    });
  }

  static async deleteContato(req: Request, res: Response) {
    const { id } = req.params;

    if (!ContatoController.validateId(id)) {
      return res
        .status(400)
        .json({ message: "ID inválido, deve ser um número" });
    }

    const idNumber = Number(id);
    const contato = await ContatoController.getById(idNumber);
    const contatoRepository = AppDataSource.getRepository(Contato);

    cache.del("data");

    if (!contato) {
      return res.status(404).json({ message: "Contato não encontrado" });
    }

    await contatoRepository.remove(contato);

    return res
      .status(200)
      .json({ message: "Contato excluído com sucesso", contato });
  }
}
