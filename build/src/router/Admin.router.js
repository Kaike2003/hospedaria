"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Admin_controller_1 = __importDefault(require("../controllers/Admin.controller"));
class AdminRouter extends Admin_controller_1.default {
    constructor() {
        super();
        this.router_admin = (0, express_1.Router)();
        this.todas_rotas_admin();
    }
    todas_rotas_admin() {
        // conta admin
        this.router_admin.post("/criarConta", super.criarConta);
        this.router_admin.put("/recuperarPalavraPasse", super.recuperarPalavraPasse);
        this.router_admin.put("/atualizarPalavraPasse/:idUtilizador", super.atualizarPalavraPasse);
        this.router_admin.put("/autenticarConta", super.autenticarConta);
        this.router_admin.put("/atualizarInformacaoPerfil/:idUtilizador", super.atualizarInformacaoPerfil);
        this.router_admin.put("/atualizarTelefone/:idUtilizador", super.atualizarTelefone);
        this.router_admin.put("/atualizarEmail/:idUtilizador", super.atualizarEmail);
        // quarto
        this.router_admin.post("/criarQuarto", super.criarQuarto);
    }
}
exports.default = AdminRouter;
