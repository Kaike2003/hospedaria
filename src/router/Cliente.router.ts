import { Router } from "express";
import ClienteController from "../controllers/Cliente.controller";
import { tipoUtilizador } from "@prisma/client";
import Permissao_rota from "../services/Permissao_rotas";


class ClienteRouter extends ClienteController {

    public router_cliente

    constructor() {
        super()
        this.router_cliente = Router()
        this.todas_rotas_cliente()
    }

    private async todas_rotas_cliente() {

        const tipo_utilizador = tipoUtilizador
        const permissao_cliente = await new Permissao_rota().permissao_rota_admin(tipo_utilizador.CLIENTE)

        //contas
        this.router_cliente.post("/criarConta", super.criarConta)
        this.router_cliente.put("/recuperarPalavraPasse", super.recuperarPalavraPasse)
        this.router_cliente.put("/atualizarPalavraPasse/:idUtilizador", permissao_cliente, super.atualizarPalavraPasse)
        this.router_cliente.put("/autenticarConta", super.autenticarConta)
        this.router_cliente.put("/atualizarInformacaoPerfil/:idUtilizador", permissao_cliente, super.atualizarInformacaoPerfil)
        this.router_cliente.put("/atualizarTelefone/:idUtilizador", permissao_cliente, super.atualizarTelefone)
        this.router_cliente.put("/atualizarEmail/:idUtilizador", permissao_cliente, super.atualizarEmail)
        this.router_cliente.post("/login", super.login)

    }


}


export default ClienteRouter