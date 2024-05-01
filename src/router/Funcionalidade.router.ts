import { Router } from "express"
import FuncionalidadeController from "../controllers/Funcionalidade.controller"
import { tipoUtilizador } from "@prisma/client"
import Permissao_rota from "../services/Permissao_rotas"




class FuncionalidadeRouter extends FuncionalidadeController {


    public router_funcionalidade

    constructor() {
        super()
        this.router_funcionalidade = Router()
        this.todas_rotas_funcionalidade()
    }

    private async todas_rotas_funcionalidade() {

        const tipo_utilizador = tipoUtilizador
        const permissao_cliente = await new Permissao_rota().permissao_rota_admin(tipo_utilizador.CLIENTE)

        // reservas
        this.router_funcionalidade.post("/criarReserva/:idQuarto", permissao_cliente, super.criarReserva)
        this.router_funcionalidade.put("/editarReserva/:idQuarto/:idReserva", permissao_cliente, super.editarReserva)
        this.router_funcionalidade.put("/cancelarReserva/:idReserva", permissao_cliente, super.cancelarReserva)
        this.router_funcionalidade.delete("/deletarReserva/:idReserva", permissao_cliente, super.deletarReserva)
        this.router_funcionalidade.get("/listarReservasConfirmadas/:email", permissao_cliente, super.listarReservasConfirmadas)
        this.router_funcionalidade.get("/listarReservasCanceladas/:email", permissao_cliente, super.listarReservasCanceladas)
        this.router_funcionalidade.get("/listarReservasPendentes/:email", permissao_cliente, super.listarReservasPendentes)
        this.router_funcionalidade.get("/listarReservasTerminadas/:email", permissao_cliente, super.listarReservasTerminadas)
        this.router_funcionalidade.post("/criarAvaliacao", permissao_cliente, super.criarAvaliacao)
        this.router_funcionalidade.put("/atualizarAvaliacao/:idAvalicao", permissao_cliente, super.atualizarAvaliacao)
        this.router_funcionalidade.get("/listarAvaliacao", permissao_cliente, super.listarAvaliacao)

    }

}


export default FuncionalidadeRouter