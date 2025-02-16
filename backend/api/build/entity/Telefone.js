"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Telefone = void 0;
const typeorm_1 = require("typeorm");
const Contato_1 = require("./Contato");
let Telefone = class Telefone {
    constructor(NUMERO, contato) {
        this.NUMERO = NUMERO;
        this.contato = contato;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Telefone.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Telefone.prototype, "NUMERO", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Contato_1.Contato, (contato) => contato.telefones),
    __metadata("design:type", Contato_1.Contato)
], Telefone.prototype, "contato", void 0);
Telefone = __decorate([
    (0, typeorm_1.Entity)({ name: "Telefone" }),
    __metadata("design:paramtypes", [String, Contato_1.Contato])
], Telefone);
exports.Telefone = Telefone;
//# sourceMappingURL=Telefone.js.map