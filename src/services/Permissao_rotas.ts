import { prisma } from './../../prisma/index';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";

interface TokenPlayload {
    utilizador_id: string
    iat: number
    exp: number
}

export default class Permissao_rota {

    public async permissao_rota_admin(tipo_utilizador: string) {

        return async (req: Request, res: Response, next: NextFunction) => {

            const segredo = "process.env.SECRET_JWT"
            const { authorization } = req.headers

            if (!authorization) {
                res.status(401).json(`Authorization está nulo`)
            } else {
                const token = authorization?.replace("Bearer", "").trim()
                try {
                    const data_token = jwt.verify(token, segredo)
                    const { utilizador_id } = data_token as TokenPlayload
                    const utilizador = await prisma.utilizador.findUnique({
                        where: {
                            id: utilizador_id
                        }
                    })
                    if (!utilizador) {
                        res.status(400).json(`O utilizador nao deve ser nulo.`)
                    } else {
                        if (utilizador.tipoUtilizador === tipo_utilizador && utilizador.id === utilizador_id) {
                            next()
                        } else {
                            res.status(403).json(`Acesso negado, rota só para administrador`)
                        }
                    }
                } catch (error) {
                    res.status(400).json(error)
                }
            }
        }

    }


    public async permissao_rota_funcionario(tipo_utilizador: string) {

        return async (req: Request, res: Response, next: NextFunction) => {

            const segredo = "process.env.SECRET_JWT"
            const { authorization } = req.headers

            console.log(authorization)

            if (!authorization) {
                res.status(401).json(`Authorization está nulo`)
            } else {
                const token = authorization?.replace("Bearer", "").trim()
                try {
                    const data_token = jwt.verify(token, segredo)
                    const { utilizador_id } = data_token as TokenPlayload
                    const utilizador = await prisma.utilizador.findUnique({
                        where: {
                            id: utilizador_id
                        }
                    })
                    if (!utilizador) {
                        res.status(400).json(`O utilizador nao deve ser nulo.`)
                    } else {
                        if (utilizador.tipoUtilizador === tipo_utilizador && utilizador.id === utilizador_id) {
                            next()
                        } else {
                            res.status(403).json(`Acesso negado, rota só para clientes`)
                        }
                    }
                } catch (error) {
                    res.status(400).json(error)
                }
            }
        }

    }

}