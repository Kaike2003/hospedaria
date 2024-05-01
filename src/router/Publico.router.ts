import { Router } from "express"
import PublicoController from "../controllers/Publico.controller"


class PublicoRouter extends PublicoController {

    public router_publico

    constructor() {
        super()
        this.router_publico = Router()
        this.todas_rotas_publico()
    }

    private todas_rotas_publico() {
        // utilizadores
        this.router_publico.get("/listarTodosUtilizadores", super.listarTodosUtilizadores)
        this.router_publico.get("/listarTodosAdmins", super.listarTodosAdmins)
        this.router_publico.get("/listarTodosClientes", super.listarTodosClientes)
        // reservas
        this.router_publico.get("/listarTodasReservasPendentes", super.listarTodasReservasPendentes)
        this.router_publico.get("/listarTodasReservasConfirmadas", super.listarTodasReservasConfirmadas)
        this.router_publico.get("/listarTodasReservasTerminadas", super.listarTodasReservasTerminadas)
        this.router_publico.get("/listarTodasReservasCanceladas", super.listarTodasReservasCanceladas)
        this.router_publico.get("/listarTodasReservas", super.listarTodasReservas)
        // quartos
        this.router_publico.get("/listarTodosQuartoIndividuas/:limite", super.listarTodosQuartoIndividuas)
        this.router_publico.get("/listarTodosQuartoSuite/:limite", super.listarTodosQuartoSuite)
        this.router_publico.get("/listarTodosQuartoDuplos/:limite", super.listarTodosQuartoDuplos)
        this.router_publico.get("/listarTodosQuartos", super.listarTodosQuartos)
        // avalicacoes
        this.router_publico.get("/listarTodasAvaliacao/:limite", super.listarTodasAvaliacao)
    }

}


export default PublicoRouter