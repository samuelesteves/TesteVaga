import "reflect-metadata";
import { DataSource } from "typeorm";
import { Contato } from "./entity/Contato";
import { Telefone } from "./entity/Telefone";

import * as dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } =
  process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: parseInt(DB_PORT || "5432"),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: NODE_ENV === "development" ? true : false,
  logging: NODE_ENV === "development" ? true : false,
  entities: [Contato, Telefone],
  migrations: [__dirname + "/migration/*.ts"],
  subscribers: [],
});
