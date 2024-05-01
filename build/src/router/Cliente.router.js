"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Cliente_controller_1 = __importDefault(require("../controllers/Cliente.controller"));
class ClienteRouter extends Cliente_controller_1.default {
    constructor() {
        super();
        this.router_cliente = (0, express_1.Router)();
        this.todas_rotas_cliente();
    }
    todas_rotas_cliente() {
        this.router_cliente.post("/criarConta", super.criarConta);
        this.router_cliente.put("/recuperarPalavraPasse", super.recuperarPalavraPasse);
        this.router_cliente.put("/atualizarPalavraPasse/:idUtilizador", super.atualizarPalavraPasse);
        this.router_cliente.put("/autenticarConta", super.autenticarConta);
        this.router_cliente.put("/atualizarInformacaoPerfil/:idUtilizador", super.atualizarInformacaoPerfil);
        this.router_cliente.put("/atualizarTelefone/:idUtilizador", super.atualizarTelefone);
        this.router_cliente.put("/atualizarEmail/:idUtilizador", super.atualizarEmail);
    }
}
exports.default = ClienteRouter;
