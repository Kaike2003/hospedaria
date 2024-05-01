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
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const Admin_router_1 = __importDefault(require("../router/Admin.router"));
const Cliente_router_1 = __importDefault(require("../router/Cliente.router"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.middlewares();
        this.router_todas = (0, express_1.Router)();
        this.todas_rotas();
    }
    middlewares() {
        this.app.use(express_1.default.json()).use((0, morgan_1.default)("dev")).use((0, cors_1.default)());
    }
    todas_rotas() {
        this.app.use("/hospedaria/admin", new Admin_router_1.default().router_admin);
        this.app.use("/hospedaria/cliente", new Cliente_router_1.default().router_cliente);
        this.app.get("/", (req, res) => {
            res.status(200).json("Rota principal funcionando...");
        });
    }
    listen(porta) {
        this.app.listen(porta, () => {
            console.log(`Servidor rodando na porta ${porta}`);
        });
    }
}
exports.default = new Server();
