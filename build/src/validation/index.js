"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaCriarQuarto = exports.SchemaAtualizarEmail = exports.SchemaAtualizarTelefone = exports.SchemaAtualizarInformacaoPerfil = exports.SchemaAutenticarConta = exports.SchemaAtualizarPalavraPasse = exports.SchemaRecuperarPalavraPasse = exports.SchemaCriarConta = void 0;
const zod_1 = __importDefault(require("zod"));
const data = new Date();
exports.SchemaCriarConta = zod_1.default.object({
    nome: zod_1.default.string().min(4).max(50),
    email: zod_1.default.string().email(),
    telefone: zod_1.default.number().min(111111111).max(999999999),
    palavraPasse: zod_1.default.string().min(4).max(40),
    data_nascimento: zod_1.default.date().min(new Date(`1500-01-01`)).max(new Date(`2014-01-01`))
});
exports.SchemaRecuperarPalavraPasse = zod_1.default.object({
    email: zod_1.default.string().email(),
});
exports.SchemaAtualizarPalavraPasse = zod_1.default.object({
    palavraPasseAntiga: zod_1.default.string().min(4).max(50),
    palavraPasseNova: zod_1.default.string().min(4).max(50),
});
exports.SchemaAutenticarConta = zod_1.default.object({
    codigo: zod_1.default.string().min(6)
});
exports.SchemaAtualizarInformacaoPerfil = zod_1.default.object({
    nome: zod_1.default.string().min(4).max(50),
    data_nascimento: zod_1.default.date().min(new Date(`1500-01-01`)).max(new Date(`2014-01-01`))
});
exports.SchemaAtualizarTelefone = zod_1.default.object({
    telefone: zod_1.default.number().min(111111111).max(999999999),
});
exports.SchemaAtualizarEmail = zod_1.default.object({
    email: zod_1.default.string().email(),
});
exports.SchemaCriarQuarto = zod_1.default.object({
    nome: zod_1.default.string().min(4).max(50),
    preco: zod_1.default.number().min(1).max(1000000000),
    tipo_quarto: zod_1.default.string().min(3).max(10),
    descricao: zod_1.default.string().min(3).max(500),
    email: zod_1.default.string().email()
});
