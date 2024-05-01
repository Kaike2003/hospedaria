"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("../validation");
const prisma_1 = require("../../prisma");
const Encriptar_1 = __importDefault(require("../services/Encriptar"));
const GerarString_1 = __importDefault(require("../services/GerarString"));
const CompararPalavraPasse_1 = __importDefault(require("../services/CompararPalavraPasse"));
const client_1 = require("@prisma/client");
class AdminController {
    criarConta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, email, telefone, data_nascimento, palavraPasse } = req.body;
                validation_1.SchemaCriarConta.parseAsync({
                    nome: nome,
                    email: email,
                    telefone: Number(telefone),
                    palavraPasse: palavraPasse,
                    data_nascimento: new Date(data_nascimento)
                }).then((sucessoValidacao) => __awaiter(this, void 0, void 0, function* () {
                    const responseEmail = yield prisma_1.prisma.utilizador.findUnique({
                        where: {
                            email: sucessoValidacao.email
                        }
                    });
                    const responseTelefone = yield prisma_1.prisma.utilizador.findUnique({
                        where: {
                            telefone: sucessoValidacao.telefone
                        }
                    });
                    if ((responseEmail === null || responseEmail === void 0 ? void 0 : responseEmail.email) === sucessoValidacao.email) {
                        res.status(400).json(`Já existe uma conta criada com o email: ${sucessoValidacao.email}`);
                    }
                    else {
                        if ((responseTelefone === null || responseTelefone === void 0 ? void 0 : responseTelefone.telefone) === sucessoValidacao.telefone) {
                            res.status(400).json(`Já existe uma conta criada com o número de teleofne: ${sucessoValidacao.telefone}`);
                        }
                        else {
                            const response = yield prisma_1.prisma.utilizador.create({
                                data: {
                                    nome: sucessoValidacao.nome,
                                    email: sucessoValidacao.email,
                                    telefone: sucessoValidacao.telefone,
                                    dataNascimento: sucessoValidacao.data_nascimento,
                                    palavraPasse: yield Encriptar_1.default.palavraPasse(sucessoValidacao.palavraPasse),
                                    tipoUtilizador: "ADMIN",
                                    codigo_autenticacao: GerarString_1.default.geradorStrings()
                                }
                            });
                            res.status(201).json(`Conta criada com sucesso`);
                        }
                    }
                })).catch((error) => {
                    res.status(400).json(error);
                });
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
    }
    recuperarPalavraPasse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                validation_1.SchemaRecuperarPalavraPasse.parseAsync({
                    email: email
                }).then((sucessovalidacao) => __awaiter(this, void 0, void 0, function* () {
                    const responseEmail = yield prisma_1.prisma.utilizador.findUnique({
                        where: {
                            email: sucessovalidacao.email
                        }
                    });
                    if ((responseEmail === null || responseEmail === void 0 ? void 0 : responseEmail.email) === sucessovalidacao.email) {
                        const response = yield prisma_1.prisma.utilizador.update({
                            where: {
                                email: responseEmail === null || responseEmail === void 0 ? void 0 : responseEmail.email
                            },
                            data: {
                                palavraPasse: yield Encriptar_1.default.palavraPasse(GerarString_1.default.geradorStrings())
                            }
                        });
                        res.status(200).json(`Sua palavra passe foi alterada com sucesso, verifique o seu email para obteres a nova palavra passe.`);
                    }
                    else {
                        res.status(400).json(`O email ${sucessovalidacao.email} Não está associado a nenhuma conta aqui na aplicação`);
                    }
                })).catch((error) => {
                    res.status(400).json(error);
                });
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
    }
    atualizarPalavraPasse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { palavraPasseAntiga, palavraPasseNova } = req.body;
                const { idUtilizador } = req.params;
                if (idUtilizador === null) {
                    res.status(400).json(`Id do utilizador obrigatorio ${idUtilizador}`);
                }
                else {
                    if (idUtilizador.length >= 15) {
                        if (typeof idUtilizador === "string") {
                            const responseUtilizador = yield prisma_1.prisma.utilizador.findUnique({
                                where: {
                                    id: idUtilizador
                                }
                            });
                            if ((responseUtilizador === null || responseUtilizador === void 0 ? void 0 : responseUtilizador.id) === idUtilizador) {
                                if (responseUtilizador.tipoUtilizador === "ADMIN") {
                                    const comparar = yield CompararPalavraPasse_1.default.comparar_palavra_passe(palavraPasseAntiga, responseUtilizador.palavraPasse);
                                    if (comparar === true) {
                                        const response = yield prisma_1.prisma.utilizador.update({
                                            where: {
                                                id: idUtilizador
                                            },
                                            data: {
                                                palavraPasse: yield Encriptar_1.default.palavraPasse(palavraPasseNova)
                                            }
                                        });
                                        res.status(200).json(`Palavra passe alterada`);
                                    }
                                    else {
                                        res.status(400).json(`A sua palavra passe antiga está incorreta`);
                                    }
                                }
                                else {
                                    res.status(400).json(`So o admin podem usar essa rota...`);
                                }
                            }
                        }
                        else {
                            res.status(400).json(`Id do utilizador inválido ${idUtilizador}`);
                        }
                    }
                    else {
                        res.status(400).json(`Id do utilizador inválido ${idUtilizador}`);
                    }
                }
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
    }
    autenticarConta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { codigo } = req.body;
                validation_1.SchemaAutenticarConta.parseAsync({
                    codigo: codigo
                }).then((sucessovalidacao) => __awaiter(this, void 0, void 0, function* () {
                    const responseCodigo = yield prisma_1.prisma.utilizador.findUnique({
                        where: {
                            codigo_autenticacao: sucessovalidacao.codigo
                        }
                    });
                    if ((responseCodigo === null || responseCodigo === void 0 ? void 0 : responseCodigo.codigo_autenticacao) === sucessovalidacao.codigo) {
                        if (responseCodigo.tipoUtilizador === "ADMIN") {
                            if (responseCodigo.autenticado === false) {
                                const response = yield prisma_1.prisma.utilizador.update({
                                    where: {
                                        codigo_autenticacao: sucessovalidacao.codigo
                                    },
                                    data: {
                                        autenticado: true
                                    }
                                });
                                res.status(200).json(`Conta autenticada com sucesso.`);
                            }
                            else {
                                res.status(200).json(`Sua conta já está autenticada`);
                            }
                        }
                        else {
                            res.status(200).json(`Essa rota é para admin...`);
                        }
                    }
                    else {
                        res.status(400).json(`Codigo de autenticacao invalido ${sucessovalidacao.codigo}`);
                    }
                })).catch((error) => {
                    res.status(400).json(error);
                });
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
    }
    atualizarInformacaoPerfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, data_nascimento } = req.body;
                const { idUtilizador } = req.params;
                validation_1.SchemaAtualizarInformacaoPerfil.parseAsync({
                    nome: nome,
                    data_nascimento: new Date(data_nascimento)
                }).then((sucessovalidacao) => __awaiter(this, void 0, void 0, function* () {
                    if (idUtilizador === null) {
                        res.status(400).json(`Id do utilizador obrigatorio ${idUtilizador}`);
                    }
                    else {
                        if (idUtilizador.length >= 15) {
                            if (typeof idUtilizador === "string") {
                                const responseUtilizador = yield prisma_1.prisma.utilizador.findUnique({
                                    where: {
                                        id: idUtilizador
                                    }
                                });
                                if ((responseUtilizador === null || responseUtilizador === void 0 ? void 0 : responseUtilizador.id) === idUtilizador) {
                                    if (responseUtilizador.tipoUtilizador === "ADMIN") {
                                        const response = yield prisma_1.prisma.utilizador.update({
                                            where: {
                                                id: responseUtilizador.id
                                            },
                                            data: {
                                                nome: sucessovalidacao.nome,
                                                dataNascimento: sucessovalidacao.data_nascimento
                                            }
                                        });
                                        res.status(200).json(`Informacoes alteradas com sucesso`);
                                    }
                                    else {
                                        res.status(400).json(`So o admin podem usar essa rota...`);
                                    }
                                }
                            }
                            else {
                                res.status(400).json(`Id do utilizador inválido ${idUtilizador}`);
                            }
                        }
                        else {
                            res.status(400).json(`Id do utilizador inválido ${idUtilizador}`);
                        }
                    }
                })).catch((error) => {
                    res.status(400).json(error);
                });
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
    }
    atualizarTelefone(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { telefone } = req.body;
                const { idUtilizador } = req.params;
                validation_1.SchemaAtualizarTelefone.parseAsync({
                    telefone: Number(telefone)
                }).then((sucessovalidacao) => __awaiter(this, void 0, void 0, function* () {
                    if (idUtilizador === null) {
                        res.status(400).json(`Id do utilizador obrigatorio ${idUtilizador}`);
                    }
                    else {
                        if (idUtilizador.length >= 15) {
                            if (typeof idUtilizador === "string") {
                                const responseUtilizador = yield prisma_1.prisma.utilizador.findUnique({
                                    where: {
                                        id: idUtilizador
                                    }
                                });
                                if ((responseUtilizador === null || responseUtilizador === void 0 ? void 0 : responseUtilizador.id) === idUtilizador) {
                                    if (responseUtilizador.tipoUtilizador === "ADMIN") {
                                        if ((responseUtilizador === null || responseUtilizador === void 0 ? void 0 : responseUtilizador.telefone) === sucessovalidacao.telefone) {
                                            res.status(400).json(`O número de telefone ${sucessovalidacao.telefone} já está sendo usado na aplicacao`);
                                        }
                                        else {
                                            const response = yield prisma_1.prisma.utilizador.update({
                                                where: { id: responseUtilizador === null || responseUtilizador === void 0 ? void 0 : responseUtilizador.id },
                                                data: { telefone: sucessovalidacao.telefone }
                                            });
                                            res.status(200).json(`Número de telefone atualizado`);
                                        }
                                    }
                                    else {
                                        res.status(400).json(`So o admin podem usar essa rota...`);
                                    }
                                }
                            }
                            else {
                                res.status(400).json(`Id do utilizador inválido ${idUtilizador}`);
                            }
                        }
                        else {
                            res.status(400).json(`Id do utilizador inválido ${idUtilizador}`);
                        }
                    }
                })).catch((error) => {
                    res.status(400).json(error);
                });
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
    }
    atualizarEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const { idUtilizador } = req.params;
                validation_1.SchemaAtualizarEmail.parseAsync({
                    email: email
                }).then((sucessovalidacao) => __awaiter(this, void 0, void 0, function* () {
                    if (idUtilizador === null) {
                        res.status(400).json(`Id do utilizador obrigatorio ${idUtilizador}`);
                    }
                    else {
                        if (idUtilizador.length >= 15) {
                            if (typeof idUtilizador === "string") {
                                const responseUtilizador = yield prisma_1.prisma.utilizador.findUnique({
                                    where: {
                                        id: idUtilizador
                                    }
                                });
                                if ((responseUtilizador === null || responseUtilizador === void 0 ? void 0 : responseUtilizador.id) === idUtilizador) {
                                    if (responseUtilizador.tipoUtilizador === "ADMIN") {
                                        if ((responseUtilizador === null || responseUtilizador === void 0 ? void 0 : responseUtilizador.email) === sucessovalidacao.email) {
                                            res.status(400).json(`O email ${sucessovalidacao.email} já está sendo usado na aplicacao`);
                                        }
                                        else {
                                            const response = yield prisma_1.prisma.utilizador.update({
                                                where: { id: responseUtilizador === null || responseUtilizador === void 0 ? void 0 : responseUtilizador.id },
                                                data: { email: sucessovalidacao.email }
                                            });
                                            res.status(200).json(`Email atualizado`);
                                        }
                                    }
                                    else {
                                        res.status(400).json(`So o admin podem usar essa rota...`);
                                    }
                                }
                            }
                            else {
                                res.status(400).json(`Id do utilizador inválido ${idUtilizador}`);
                            }
                        }
                        else {
                            res.status(400).json(`Id do utilizador inválido ${idUtilizador}`);
                        }
                    }
                })).catch((error) => {
                    res.status(400).json(error);
                });
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
    }
    criarQuarto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { descricao, email, nome, preco, tipo_quarto } = req.body;
                const quarto = client_1.tipoQuarto;
                validation_1.SchemaCriarQuarto.parseAsync({
                    descricao: descricao,
                    email: email,
                    nome: nome,
                    preco: Number(preco),
                    tipo_quarto: tipo_quarto
                }).then((sucessovalidacao) => __awaiter(this, void 0, void 0, function* () {
                    const responseEmail = yield prisma_1.prisma.utilizador.findUnique({
                        where: { email: sucessovalidacao.email, tipoUtilizador: "ADMIN" }
                    });
                    if ((responseEmail === null || responseEmail === void 0 ? void 0 : responseEmail.email) === sucessovalidacao.email) {
                        if (responseEmail.tipoUtilizador === "ADMIN") {
                            if (sucessovalidacao.tipo_quarto === quarto.DUPLO || sucessovalidacao.tipo_quarto === quarto.INDIVIDUAL || sucessovalidacao.tipo_quarto === quarto.SUITE) {
                                const response = yield prisma_1.prisma.quarto.create({
                                    data: {
                                        nome: sucessovalidacao.nome,
                                        descricao: sucessovalidacao.descricao,
                                        tipoQuarto: sucessovalidacao.tipo_quarto,
                                        preco: preco,
                                        utilizadorId: responseEmail.id,
                                    }
                                });
                                res.status(200).json(`Quarto criado`);
                            }
                            else {
                            }
                        }
                        else {
                            res.status(400).json(`Acesso restrito para administradores`);
                        }
                    }
                    else {
                        res.status(400).json(`Email invalido`);
                    }
                })).catch((error) => {
                    res.status(400).json(error);
                });
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
    }
}
exports.default = AdminController;
