import { Request, Response } from "express"
import { prisma } from "../../prisma"

class PublicoController {

    // utilizadores

    async listarTodosUtilizadores(req: Request, res: Response) {

        const response = await prisma.utilizador.findMany()

        res.status(200).json(response)

    }

    async listarTodosAdmins(req: Request, res: Response) {

        const response = await prisma.utilizador.findMany({ where: { tipoUtilizador: "ADMIN" } })

        res.status(200).json(response)

    }

    async listarTodosClientes(req: Request, res: Response) {

        const response = await prisma.utilizador.findMany({ where: { tipoUtilizador: "CLIENTE" } })

        res.status(200).json(response)

    }

    // reservas

    async listarTodasReservasPendentes(req: Request, res: Response) {

        const response = await prisma.reserva.findMany({ where: { estado: "PENDENTE" } })

        res.status(200).json(response)

    }

    async listarTodasReservasConfirmadas(req: Request, res: Response) {

        const response = await prisma.reserva.findMany({ where: { estado: "CONFIRMADA" } })

        res.status(200).json(response)

    }

    async listarTodasReservasCanceladas(req: Request, res: Response) {

        const response = await prisma.reserva.findMany({ where: { estado: "CANCELADA" } })

        res.status(200).json(response)

    }

    async listarTodasReservasTerminadas(req: Request, res: Response) {

        const response = await prisma.reserva.findMany({ where: { estado: "CANCELADA" } })

        res.status(200).json(response)

    }

    protected async listarTodasReservas(req: Request, res: Response) {

        const response = await prisma.reserva.findMany()

        res.status(200).json(response)

    }

    // quartos

    async listarTodosQuartoIndividuas(req: Request, res: Response) {

        const { limite } = req.params

        if (typeof Number(limite) === "number") {

            if (Number(limite) > 0) {


                const response = await prisma.quarto.findMany({
                    where: { tipoQuarto: "INDIVIDUAL" },
                    take: Number(limite)
                })

                res.status(200).json(response)

            } else {
                res.status(200).json(`O limite deve ser maio que 0`)
            }

        } else {
            res.status(200).json(`O limite deve ser number`)
        }



    }

    async listarTodosQuartoDuplos(req: Request, res: Response) {

        const { limite } = req.params

        if (typeof Number(limite) === "number") {

            if (Number(limite) > 0) {


                const response = await prisma.quarto.findMany({
                    where: { tipoQuarto: "DUPLO" },
                    take: Number(limite)
                })

                res.status(200).json(response)

            } else {
                res.status(200).json(`O limite deve ser maio que 0`)
            }

        } else {
            res.status(200).json(`O limite deve ser number`)
        }



    }

    async listarTodosQuartoSuite(req: Request, res: Response) {

        const { limite } = req.params

        if (typeof Number(limite) === "number") {

            if (Number(limite) > 0) {


                const response = await prisma.quarto.findMany({
                    where: { tipoQuarto: "SUITE" },
                    take: Number(limite)
                })

                res.status(200).json(response)

            } else {
                res.status(200).json(`O limite deve ser maio que 0`)
            }

        } else {
            res.status(200).json(`O limite deve ser number`)
        }



    }

    async listarTodosQuartos(req: Request, res: Response) {

        const resposne = await prisma.quarto.findMany()

        res.status(200).json(resposne)

    }

    //avaliacoes 

    async listarTodasAvaliacao(req: Request, res: Response) {

        const { limite } = req.params

        if (typeof Number(limite) === "number") {

            if (Number(limite) > 0) {


                const response = await prisma.avaliacao.findMany({
                    take: Number(limite)
                })

                res.status(200).json(response)

            } else {
                res.status(200).json(`O limite deve ser maio que 0`)
            }

        } else {
            res.status(200).json(`O limite deve ser number`)
        }


    }

}


export default PublicoController