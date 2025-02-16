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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const data_source_1 = require("./data-source");
const ContatoRouter_1 = require("./routes/ContatoRouter");
const error_middleware_1 = require("./middleware/error.middleware");
require("reflect-metadata");
dotenv.config();
const app = (0, express_1.default)();
const { PORT = 5000 } = process.env;
const cors = require("cors");
app.use(cors());
app.use(express_1.default.json());
app.use("/api", ContatoRouter_1.contatoRouter);
app.all("*", (req, res) => {
    res.status(404).json({ message: "Endpoint não encontrado" });
});
app.use(error_middleware_1.errorHandler);
data_source_1.AppDataSource.initialize()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server rodando em http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error("Erro ao inicializar o banco de dados", error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map