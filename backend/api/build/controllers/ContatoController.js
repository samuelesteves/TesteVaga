"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContatoController = void 0;
const cache = __importStar(require("memory-cache"));
const data_source_1 = require("../data-source");
const Contato_1 = require("../entity/Contato");
class ContatoController {
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const contatoRepository = data_source_1.AppDataSource.getRepository(Contato_1.Contato);
            return yield contatoRepository
                .createQueryBuilder("contato")
                .where("contato.ID = :id", { id })
                .getOne();
        });
    }
    static validateId(id) {
        const idNumber = Number(id);
        return !isNaN(idNumber);
    }
    static validateFields(NOME, IDADE) {
        if (!NOME || !IDADE)
            return false;
        return !(NOME.length > 100 || IDADE > 120);
    }
    static getAllContatos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = cache.get("data");
            if (data) {
                console.log("get from cache");
                return res.status(200).json({
                    data,
                });
            }
            else {
                console.log("get from database");
                const contatoRepository = data_source_1.AppDataSource.getRepository(Contato_1.Contato);
                const contatos = yield contatoRepository.find({
                    relations: ["telefones"],
                });
                cache.put("data", contatos, 10000);
                return res.status(200).json({
                    data: contatos,
                });
            }
        });
    }
    static getContatoById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!ContatoController.validateId(id)) {
                return res
                    .status(400)
                    .json({ message: "ID inválido, deve ser um número" });
            }
            const idNumber = Number(id);
            const contatoRepository = data_source_1.AppDataSource.getRepository(Contato_1.Contato);
            const contato = yield contatoRepository.findOne({
                where: { ID: idNumber },
                relations: ["telefones"],
            });
            if (!contato) {
                return res.status(404).json({ message: "Contato não encontrado" });
            }
            return res.status(200).json(contato);
        });
    }
    static createContato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const contato = new Contato_1.Contato();
            if (!ContatoController.validateFields(req.body.NOME, req.body.IDADE)) {
                return res.status(400).json({ message: "Nome ou idade inválidos." });
            }
            contato.NOME = req.body.NOME;
            contato.IDADE = req.body.IDADE;
            contato.telefones = req.body.telefones;
            const contatoRepository = data_source_1.AppDataSource.getRepository(Contato_1.Contato);
            yield contatoRepository.save(contato);
            cache.del("data");
            return res
                .status(200)
                .json({ message: "Contato criado com sucesso", contato });
        });
    }
    static updateContato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const contato = yield ContatoController.getById(idNumber);
            const contatoRepository = data_source_1.AppDataSource.getRepository(Contato_1.Contato);
            if (!contato) {
                return res.status(404).json({ message: "Contato não encontrado" });
            }
            Object.assign(contato, req.body);
            yield contatoRepository.save(contato);
            cache.del("data");
            return res.status(200).json({
                message: "Contato atualizado com sucesso",
                contato,
            });
        });
    }
    static deleteContato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!ContatoController.validateId(id)) {
                return res
                    .status(400)
                    .json({ message: "ID inválido, deve ser um número" });
            }
            const idNumber = Number(id);
            const contato = yield ContatoController.getById(idNumber);
            const contatoRepository = data_source_1.AppDataSource.getRepository(Contato_1.Contato);
            cache.del("data");
            if (!contato) {
                return res.status(404).json({ message: "Contato não encontrado" });
            }
            yield contatoRepository.remove(contato);
            return res
                .status(200)
                .json({ message: "Contato excluído com sucesso", contato });
        });
    }
}
exports.ContatoController = ContatoController;
//# sourceMappingURL=ContatoController.js.map