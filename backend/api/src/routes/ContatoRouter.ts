import * as express from "express";
import { ContatoController } from "../controllers/ContatoController";

const Router = express.Router();

Router.get("/contatos", ContatoController.getAllContatos);
Router.get("/contatos/:id", ContatoController.getContatoById);
Router.post("/contatos", ContatoController.createContato);
Router.put("/contatos/:id", ContatoController.updateContato);
Router.delete("/contatos/:id", ContatoController.deleteContato);

export { Router as contatoRouter };
