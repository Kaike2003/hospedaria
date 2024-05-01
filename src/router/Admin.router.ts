import { Router } from "express";
import AdminController from "../controllers/Admin.controller";
import { tipoUtilizador } from "@prisma/client";
import Permissao_rota from "../services/Permissao_rotas";


class AdminRouter extends AdminController {

    public router_admin

    constructor() {
        super()
        this.router_admin = Router()
        this.todas_rotas_admin()
    }

    private async todas_rotas_admin() {

        const tipo_utilizador = tipoUtilizador
        const permissao_admin = await new Permissao_rota().permissao_rota_admin(tipo_utilizador.ADMIN)


        // conta admin
        this.router_admin.post("/criarConta", super.criarConta)
        this.router_admin.put("/recuperarPalavraPasse", super.recuperarPalavraPasse)
        this.router_admin.put("/atualizarPalavraPasse/:idUtilizador", permissao_admin, super.atualizarPalavraPasse)
        this.router_admin.put("/autenticarConta", super.autenticarConta)
        this.router_admin.put("/atualizarInformacaoPerfil/:idUtilizador", permissao_admin, super.atualizarInformacaoPerfil)
        this.router_admin.put("/atualizarTelefone/:idUtilizador", permissao_admin, super.atualizarTelefone)
        this.router_admin.put("/atualizarEmail/:idUtilizador", permissao_admin, super.atualizarEmail)
        this.router_admin.post("/login", super.login)
        // quarto
        this.router_admin.post("/criarQuarto", permissao_admin, super.criarQuarto)
        this.router_admin.put("/editarQuarto/:idQuarto", permissao_admin, super.editarQuarto)
        this.router_admin.put("/publicarQuarto/:idQuarto", permissao_admin, super.publicarQuarto)
        this.router_admin.delete("/deletarQuarto/:idQuarto", permissao_admin, super.deletarQuarto)
        this.router_admin.get("/listarQuarto", permissao_admin, super.listarQuarto)

        // reserva
        this.router_admin.put("/confirmarReserva/:idReserva", permissao_admin, super.confirmarReserva)
    }

}

export default AdminRouter