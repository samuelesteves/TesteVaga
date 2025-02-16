import express from "express";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { contatoRouter } from "./routes/ContatoRouter";
import { errorHandler } from "./middleware/error.middleware";
import "reflect-metadata";

dotenv.config();

const app = express();
const { PORT = 5000 } = process.env;

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use("/api", contatoRouter);

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Endpoint não encontrado" });
});

app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao inicializar o banco de dados", error);
    process.exit(1);
  });
