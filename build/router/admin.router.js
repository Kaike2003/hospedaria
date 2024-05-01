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
        this.router_admin.get("/criarConta", super.criarConta);
    }
}
exports.default = AdminRouter;
