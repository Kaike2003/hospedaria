import { Request, Response } from "express"
import { SchemaAvaliacao, SchemaListarReservas, SchemaOmitMensagemAvalicao, SchemacriarReserva, TSchemaAvaliacao, TSchemaListarAvaliacao, TSchemaListarReservas, TSchemacriarReserva } from "../validation"
import { CronJob } from 'cron';
import { prisma } from "../../prisma";
import Nodemailer from "../services/Nodemailer";

const job = new CronJob(
    '*/5 * * * *', // cronTime
    async () => {

        const responseQuarto = await prisma.quarto.findMany({ where: { publicado: true } })
        const responseReserva = await prisma.reserva.findMany({ where: { estado: "CONFIRMADA" } })

        responseQuarto.map(async ({ id, publicado }: { id: string, publicado: boolean }) => {


            if (publicado === true) {

                await prisma.quarto.update({
                    where: { id: id },
                    data: { aprovado: true }
                })

            } else {
                return null
            }

        })

        responseReserva.map(async ({ id, dataSaida, quartoId }: { id: string, dataSaida: Date, utilizadorId: string, quartoId: string }) => {

            if (new Date() === dataSaida) {

                await prisma.reserva.update({
                    where: { id: id },
                    data: {
                        estado: "TERMINADA"
                    }
                })

                await prisma.quarto.update({
                    where: { id: quartoId },
                    data: { disponibilidade: true }
                })

            } else {
                return null
            }

        })


    }, // onTick
    null, // onComplete
    true, // start
    'America/Los_Angeles' // timeZone
);


class FuncionalidadeController {

    // reservas

    protected async criarReserva(req: Request, res: Response) {

        try {

            const { dataEntrada, dataSaida, email }: TSchemacriarReserva = req.body
            const { idQuarto } = req.params

            SchemacriarReserva.parseAsync({
                email: email,
                dataEntrada: new Date(dataEntrada),
                dataSaida: new Date(dataSaida)
            }).then(async (sucessovalidacao) => {

                if (idQuarto === null) {

                    res.status(400).json('O id do quarto esta invalido')

                } else {

                    if (idQuarto.length >= 15) {

                        const responseQuarto = await prisma.quarto.findUnique({
                            where: { id: idQuarto }
                        })

                        const responseEmail = await prisma.utilizador.findUnique({
                            where: { email: sucessovalidacao.email }
                        })

                        if (responseEmail?.email === sucessovalidacao.email) {


                            if (responseQuarto?.id === idQuarto) {

                                if (responseQuarto.disponibilidade === false) {

                                    res.status(400).json(`Nesse momento o quarto está indesponivel para reservas`)

                                } else {

                                    if (sucessovalidacao.dataSaida > sucessovalidacao.dataEntrada) {

                                        var diferenca_dias = Math.abs(Number(sucessovalidacao.dataSaida) - Number(sucessovalidacao.dataEntrada))
                                        var dias = diferenca_dias / (1000 * 3600 * 24)

                                        const response = await prisma.reserva.create({
                                            data: {
                                                dataEntrada: sucessovalidacao.dataEntrada,
                                                dataSaida: sucessovalidacao.dataSaida,
                                                quartoId: responseQuarto.id,
                                                utilizadorId: responseEmail?.id,
                                                valorTotal: dias * responseQuarto.preco,
                                                estado: "PENDENTE",
                                            }
                                        })

                                        const quarto = await prisma.quarto.update({
                                            where: { id: responseQuarto.id },
                                            data: {
                                                disponibilidade: false
                                            }
                                        })

                                        new Nodemailer().reservaPendente(responseEmail.email, responseEmail.nome, responseQuarto.tipoQuarto, dias * responseQuarto.preco)
                                        res.status(200).json(`Reserva pendente, enviamos todos os dados para o seu email`)

                                    } else {
                                        res.status(400).json('Data de saida precisa ser maior que a data de entrada')
                                    }



                                }



                            } else {
                                res.status(400).json('O id do quarto esta invalido')
                            }

                        } else {
                            res.status(400).json(`O email do utilizador esta invalido`)
                        }

                    } else {
                        res.status(400).json('O id do quarto esta invalido')
                    }

                }


            }).catch((error) => {
                res.status(400).json(error)
            })


        } catch (error) {
            res.status(400).json(error)
        }



    }

    protected async editarReserva(req: Request, res: Response) {

        try {

            const { dataEntrada, dataSaida, email }: TSchemacriarReserva = req.body
            const { idQuarto, idReserva } = req.params

            SchemacriarReserva.parseAsync({
                email: email,
                dataEntrada: new Date(dataEntrada),
                dataSaida: new Date(dataSaida)
            }).then(async (sucessovalidacao) => {

                if (idQuarto === null) {

                    res.status(400).json('O id do quarto esta invalido')

                } else {

                    if (idQuarto.length >= 15) {


                        if (idQuarto.length >= 15) {

                            const responseQuarto = await prisma.quarto.findUnique({
                                where: { id: idQuarto }
                            })

                            const responseEmail = await prisma.utilizador.findUnique({
                                where: { email: sucessovalidacao.email }
                            })

                            const responseReserva = await prisma.reserva.findUnique({
                                where: {
                                    id: idReserva
                                }
                            })

                            if (responseEmail?.email === sucessovalidacao.email) {

                                if (responseReserva?.id === idReserva) {


                                    if (responseQuarto?.id === idQuarto) {

                                        if (sucessovalidacao.dataSaida > sucessovalidacao.dataEntrada) {

                                            var diferenca_dias = Math.abs(Number(sucessovalidacao.dataSaida) - Number(sucessovalidacao.dataEntrada))
                                            var dias = diferenca_dias / (1000 * 3600 * 24)

                                            const response = await prisma.reserva.update({
                                                where: {
                                                    id: responseReserva?.id
                                                },
                                                data: {
                                                    dataEntrada: sucessovalidacao.dataEntrada,
                                                    dataSaida: sucessovalidacao.dataSaida,
                                                    quartoId: responseQuarto.id,
                                                    utilizadorId: responseEmail?.id,
                                                    valorTotal: dias * responseQuarto.preco,
                                                }
                                            })

                                            res.status(200).json(`Reserva editada`)


                                        } else {
                                            res.status(400).json('Data de saida precisa ser maior que a data de entrada')
                                        }


                                    } else {
                                        res.status(400).json('O id do quarto esta invalido')
                                    }


                                } else {
                                    res.status(400).json('O id da reserva esta invalido')
                                }


                            } else {
                                res.status(400).json(`O email do utilizador esta invalido`)
                            }

                        } else {
                            res.status(400).json('O id da reserva esta invalido')
                        }

                    } else {
                        res.status(400).json('O id do quarto esta invalido')
                    }

                }


            }).catch((error) => {
                res.status(400).json(error)
            })


        } catch (error) {
            res.status(400).json(error)
        }


    }

    protected async cancelarReserva(req: Request, res: Response) {

        const { idReserva } = req.params


        if (idReserva === null) {

            res.status(400).json('O id da reserva esta invalido')

        } else {

            if (idReserva.length >= 15) {

                const responseReserva = await prisma.reserva.findUnique({
                    where: { id: idReserva }
                })



                if (responseReserva?.id === idReserva) {


                    if (responseReserva.estado === "PENDENTE") {

                        const response = await prisma.reserva.update({
                            where: { id: responseReserva.id },
                            data: {
                                estado: "CANCELADA"
                            }
                        })

                        const responseQuarto = await prisma.quarto.update({
                            where: { id: responseReserva.quartoId },
                            data: {
                                disponibilidade: true
                            }
                        })

                        res.status(200).json(`Reserva cancelada, enviamos todos os dados para o seu email`)

                    } else {
                        res.status(200).json(`Reserva ja nao pode ser cancelada`)
                    }



                } else {
                    res.status(400).json('O id da reserva esta invalido')
                }


            } else {
                res.status(400).json('O id da reserva esta invalido')
            }

        }

    }

    protected async deletarReserva(req: Request, res: Response) {

        const { idReserva } = req.params


        if (idReserva === null) {

            res.status(400).json('O id da reserva esta invalido')

        } else {

            if (idReserva.length >= 15) {

                const responseReserva = await prisma.reserva.findUnique({
                    where: { id: idReserva }
                })



                if (responseReserva?.id === idReserva) {


                    if (responseReserva.estado === "PENDENTE" || responseReserva.estado === "CONFIRMADA" || responseReserva.estado === "TERMINADA" || responseReserva.estado === "CANCELADA") {

                        const response = await prisma.reserva.delete({
                            where: { id: responseReserva.id },
                        })

                        const responseQuarto = await prisma.quarto.update({
                            where: { id: responseReserva.quartoId },
                            data: {
                                disponibilidade: true
                            }
                        })

                        res.status(200).json(`Reserva deletada`)

                    } else {
                        res.status(200).json(`Reserva ja nao pode ser deletada`)
                    }



                } else {
                    res.status(400).json('O id da reserva esta invalido')
                }


            } else {
                res.status(400).json('O id da reserva esta invalido')
            }

        }

    }

    protected async listarReservasConfirmadas(req: Request, res: Response) {
        try {


            const email = String(req.params.email)

            SchemaListarReservas.parseAsync({
                email: email
            }).then(async (sucessovalidacao) => {

                const responseEmail = await prisma.utilizador.findUnique({
                    where: { email: email }
                })

                if (responseEmail?.email === sucessovalidacao.email) {

                    const response = await prisma.reserva.findMany({
                        where: {
                            utilizadorId: responseEmail.id,
                            estado: "CONFIRMADA"
                        }
                    })

                    res.status(200).json(response)

                } else {
                    res.status(400).json(`Credencias invalidas`)
                }

            }).catch((error) => {
                res.status(400).json(error)
            })


        } catch (error) {
            res.status(400).json(error)
        }
    }

    protected async listarReservasCanceladas(req: Request, res: Response) {
        try {


            const email = String(req.params.email)

            SchemaListarReservas.parseAsync({
                email: email
            }).then(async (sucessovalidacao) => {

                const responseEmail = await prisma.utilizador.findUnique({
                    where: { email: email }
                })

                if (responseEmail?.email === sucessovalidacao.email) {

                    const response = await prisma.reserva.findMany({
                        where: {
                            utilizadorId: responseEmail.id,
                            estado: "CANCELADA"
                        }
                    })

                    res.status(200).json(response)

                } else {
                    res.status(400).json(`Credencias invalidas`)
                }

            }).catch((error) => {
                res.status(400).json(error)
            })


        } catch (error) {
            res.status(400).json(error)
        }
    }

    protected async listarReservasTerminadas(req: Request, res: Response) {
        try {


            const email = String(req.params.email)

            SchemaListarReservas.parseAsync({
                email: email
            }).then(async (sucessovalidacao) => {

                const responseEmail = await prisma.utilizador.findUnique({
                    where: { email: email }
                })

                if (responseEmail?.email === sucessovalidacao.email) {

                    const response = await prisma.reserva.findMany({
                        where: {
                            utilizadorId: responseEmail.id,
                            estado: "TERMINADA"
                        }
                    })

                    res.status(200).json(response)

                } else {
                    res.status(400).json(`Credencias invalidas`)
                }

            }).catch((error) => {
                res.status(400).json(error)
            })


        } catch (error) {
            res.status(400).json(error)
        }
    }

    protected async listarReservasPendentes(req: Request, res: Response) {
        try {


            const email = String(req.params.email)

            SchemaListarReservas.parseAsync({
                email: email
            }).then(async (sucessovalidacao) => {

                const responseEmail = await prisma.utilizador.findUnique({
                    where: { email: email }
                })

                if (responseEmail?.email === sucessovalidacao.email) {

                    const response = await prisma.reserva.findMany({
                        where: {
                            utilizadorId: responseEmail.id,
                            estado: "PENDENTE"
                        }
                    })

                    res.status(200).json(response)

                } else {
                    res.status(400).json(`Credencias invalidas`)
                }

            }).catch((error) => {
                res.status(400).json(error)
            })


        } catch (error) {
            res.status(400).json(error)
        }
    }

    

    protected async criarAvaliacao(req: Request, res: Response) {

        const { email, mensagem }: TSchemaAvaliacao = req.body

        SchemaAvaliacao.parseAsync({
            email: email,
            mensagem: mensagem
        }).then(async (sucessoValidacao) => {

            const responseEmail = await prisma.utilizador.findUnique({
                where: { email: sucessoValidacao.email }
            })

            if (responseEmail?.email === sucessoValidacao.email) {

                const response = await prisma.avaliacao.create({
                    data: {
                        mensagem: sucessoValidacao.mensagem,
                        utilizadorId: responseEmail.id
                    }
                })

                res.status(200).json(`Obrigado pela sua avaliação, vai nos ajudar muito a melhorar oss nosso serviços.`)

            } else {
                res.status(400).json(`Email invalido ${sucessoValidacao.email}`)
            }

        }).catch((error) => {
            res.status(400).json(error)
        })


    }

    protected async atualizarAvaliacao(req: Request, res: Response) {

        const { email, mensagem }: TSchemaAvaliacao = req.body
        const { idAvalicao } = req.params

        SchemaAvaliacao.parseAsync({
            email: email,
            mensagem: mensagem
        }).then(async (sucessoValidacao) => {

            if (typeof idAvalicao === "string") {

                if (idAvalicao.length >= 15) {


                    const responseEmail = await prisma.utilizador.findUnique({
                        where: { email: sucessoValidacao.email }
                    })

                    const responseAvaliacao = await prisma.avaliacao.findUnique({
                        where: { id: idAvalicao }
                    })

                    if (responseAvaliacao?.id === idAvalicao) {


                        if (responseEmail?.email === sucessoValidacao.email) {

                            const response = await prisma.avaliacao.update({
                                where: { id: responseAvaliacao.id },
                                data: {
                                    mensagem: sucessoValidacao.mensagem,
                                    utilizadorId: responseEmail.id
                                }
                            })

                            res.status(200).json(`Obrigado pela sua avaliação, vai nos ajudar muito a melhorar oss nosso serviços.`)

                        } else {
                            res.status(400).json(`Email invalido ${sucessoValidacao.email}`)
                        }


                    } else {
                        res.status(400).json(`Id da avaliacao invalido`)
                    }




                } else {
                    res.status(400).json(`Id da avaliacao invalido`)
                }


            } else {
                res.status(400).json(`Id da avaliacao invalido`)
            }



        }).catch((error) => {
            res.status(400).json(error)
        })

    }

    protected async listarAvaliacao(req: Request, res: Response) {

        const { email }: TSchemaListarAvaliacao = req.body

        SchemaOmitMensagemAvalicao.parseAsync({
            email: email
        }).then(async (sucessoValidacao) => {

            const responseEmail = await prisma.utilizador.findUnique({
                where: { email: sucessoValidacao.email }
            })


            if (responseEmail?.email === sucessoValidacao.email) {

                const response = await prisma.avaliacao.findMany({
                    where: { utilizadorId: responseEmail.id },
                })

                res.status(200).json(response)

            } else {
                res.status(400).json(`Email invalido ${sucessoValidacao.email}`)
            }





        }).catch((error) => {
            res.status(400).json(error)
        })

    }


}


export default FuncionalidadeController