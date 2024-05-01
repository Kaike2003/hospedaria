import { Request, Response } from "express"
import { SchemaAtualizarEmail, SchemaAtualizarInformacaoPerfil, SchemaAtualizarTelefone, SchemaAutenticarConta, SchemaCriarConta, SchemaLogin, SchemaRecuperarPalavraPasse, TSchemaAtualizarEmail, TSchemaAtualizarInformacaoPerfil, TSchemaAtualizarPalavraPasse, TSchemaAtualizarTelefone, TSchemaAutenticarConta, TSchemaCriarConta, TSchemaLogin, TSchemaRecuperarPalavraPasse } from "../validation"
import { prisma } from "../../prisma"
import Encriptar from "../services/Encriptar"
import GerarString from "../services/GerarString"
import CompararPalavraPasse from "../services/CompararPalavraPasse"
import Jwt from "../services/Jwt"
import Nodemailer from "../services/Nodemailer"

class ClienteController {

    // conta

    protected async criarConta(req: Request, res: Response) {

        try {

            const { nome, email, telefone, data_nascimento, palavraPasse }: TSchemaCriarConta = req.body

            SchemaCriarConta.parseAsync({
                nome: nome,
                email: email,
                telefone: Number(telefone),
                palavraPasse: palavraPasse,
                data_nascimento: new Date(data_nascimento)
            }).then(async (sucessoValidacao) => {

                const responseEmail = await prisma.utilizador.findUnique({
                    where: {
                        email: sucessoValidacao.email
                    }
                })

                const responseTelefone = await prisma.utilizador.findUnique({
                    where: {
                        telefone: sucessoValidacao.telefone
                    }
                })

                if (responseEmail?.email === sucessoValidacao.email) {
                    res.status(400).json(`Já existe uma conta criada com o email: ${sucessoValidacao.email}`)
                } else {

                    if (responseTelefone?.telefone === sucessoValidacao.telefone) {
                        res.status(400).json(`Já existe uma conta criada com o número de teleofne: ${sucessoValidacao.telefone}`)
                    } else {

                        const response = await prisma.utilizador.create({
                            data: {
                                nome: sucessoValidacao.nome,
                                email: sucessoValidacao.email,
                                telefone: sucessoValidacao.telefone,
                                dataNascimento: sucessoValidacao.data_nascimento,
                                palavraPasse: await Encriptar.palavraPasse(sucessoValidacao.palavraPasse),
                                tipoUtilizador: "CLIENTE",
                                codigo_autenticacao: GerarString.geradorStrings()
                            }
                        })

                        new Nodemailer().criarConta(response.email, response.nome, response.codigo_autenticacao)

                        res.status(201).json(`Conta criada com sucesso`)


                    }


                }

            }).catch((error) => {
                res.status(400).json(error)
            })

        } catch (error) {
            res.status(400).json(error)
        }

    }

    protected async recuperarPalavraPasse(req: Request, res: Response) {

        try {


            const { email }: TSchemaRecuperarPalavraPasse = req.body
            const novaPalavraPasse = GerarString.geradorStrings();


            SchemaRecuperarPalavraPasse.parseAsync({
                email: email
            }).then(async (sucessovalidacao) => {

                const responseEmail = await prisma.utilizador.findUnique({
                    where: {
                        email: sucessovalidacao.email
                    }
                })

                if (responseEmail?.email === sucessovalidacao.email) {

                    const response = await prisma.utilizador.update({
                        where: {
                            email: responseEmail?.email
                        },
                        data: {
                            palavraPasse: await Encriptar.palavraPasse(GerarString.geradorStrings())
                        }
                    })

                    new Nodemailer().recuperarPalavraPasse(response.email, response.nome, novaPalavraPasse)

                    res.status(200).json(`Sua palavra passe foi alterada com sucesso, verifique o seu email para obteres a nova palavra passe.`)

                } else {
                    res.status(400).json(`O email ${sucessovalidacao.email} Não está associado a nenhuma conta aqui na aplicação`)
                }

            }).catch((error) => {
                res.status(400).json(error)
            })

        } catch (error) {
            res.status(400).json(error)
        }

    }

    protected async atualizarPalavraPasse(req: Request, res: Response) {

        try {

            const { palavraPasseAntiga, palavraPasseNova }: TSchemaAtualizarPalavraPasse = req.body
            const { idUtilizador } = req.params


            if (idUtilizador === null) {

                res.status(400).json(`Id do utilizador obrigatorio ${idUtilizador}`)

            } else {

                if (idUtilizador.length >= 15) {

                    if (typeof idUtilizador === "string") {

                        const responseUtilizador = await prisma.utilizador.findUnique({
                            where: {
                                id: idUtilizador
                            }
                        })

                        if (responseUtilizador?.id === idUtilizador) {

                            if (responseUtilizador.tipoUtilizador === "CLIENTE") {

                                const comparar = await CompararPalavraPasse.comparar_palavra_passe(palavraPasseAntiga, responseUtilizador.palavraPasse)

                                if (comparar === true) {

                                    const response = await prisma.utilizador.update({
                                        where: {
                                            id: idUtilizador
                                        },
                                        data: {
                                            palavraPasse: await Encriptar.palavraPasse(palavraPasseNova)
                                        }
                                    })

                                    res.status(200).json(`Palavra passe alterada`)

                                } else {
                                    res.status(400).json(`A sua palavra passe antiga está incorreta`)
                                }


                            } else {
                                res.status(400).json(`So o cliente podem usar essa rota...`)
                            }

                        }

                    } else {
                        res.status(400).json(`Id do utilizador inválido ${idUtilizador}`)
                    }



                } else {
                    res.status(400).json(`Id do utilizador inválido ${idUtilizador}`)
                }
            }

        } catch (error) {
            res.status(400).json(error)
        }



    }

    protected async autenticarConta(req: Request, res: Response) {

        try {

            const { codigo }: TSchemaAutenticarConta = req.body

            SchemaAutenticarConta.parseAsync({
                codigo: codigo
            }).then(async (sucessovalidacao) => {

                const responseCodigo = await prisma.utilizador.findUnique({
                    where: {
                        codigo_autenticacao: sucessovalidacao.codigo
                    }
                })

                if (responseCodigo?.codigo_autenticacao === sucessovalidacao.codigo) {

                    if (responseCodigo.tipoUtilizador === "CLIENTE") {

                        if (responseCodigo.autenticado === false) {

                            const response = await prisma.utilizador.update({
                                where: {
                                    codigo_autenticacao: sucessovalidacao.codigo
                                },
                                data: {
                                    autenticado: true
                                }
                            })

                            res.status(200).json(`Conta autenticada com sucesso.`)

                        } else {
                            res.status(200).json(`Sua conta já está autenticada`)
                        }

                    } else {
                        res.status(200).json(`Essa rota é para cliente...`)
                    }

                } else {
                    res.status(400).json(`Codigo de autenticacao invalido ${sucessovalidacao.codigo}`)
                }

            }).catch((error) => {
                res.status(400).json(error)
            })

        } catch (error) {
            res.status(400).json(error)
        }


    }

    protected async atualizarInformacaoPerfil(req: Request, res: Response) {

        try {

            const { nome, data_nascimento }: TSchemaAtualizarInformacaoPerfil = req.body
            const { idUtilizador } = req.params

            console.log(nome, data_nascimento)

            SchemaAtualizarInformacaoPerfil.parseAsync({
                nome: nome,
                data_nascimento: new Date(data_nascimento)
            }).then(async (sucessovalidacao) => {

                if (idUtilizador === null) {

                    res.status(400).json(`Id do utilizador obrigatorio ${idUtilizador}`)

                } else {

                    if (idUtilizador.length >= 15) {

                        if (typeof idUtilizador === "string") {

                            const responseUtilizador = await prisma.utilizador.findUnique({
                                where: {
                                    id: idUtilizador
                                }
                            })

                            if (responseUtilizador?.id === idUtilizador) {

                                if (responseUtilizador.tipoUtilizador === "CLIENTE") {


                                    const response = await prisma.utilizador.update({
                                        where: {
                                            id: responseUtilizador.id
                                        },
                                        data: {
                                            nome: sucessovalidacao.nome,
                                            dataNascimento: sucessovalidacao.data_nascimento
                                        }
                                    })

                                    res.status(200).json(`Informacoes alteradas com sucesso`)


                                } else {
                                    res.status(400).json(`So o cliente podem usar essa rota...`)
                                }

                            }

                        } else {
                            res.status(400).json(`Id do utilizador inválido ${idUtilizador}`)
                        }



                    } else {
                        res.status(400).json(`Id do utilizador inválido ${idUtilizador}`)
                    }
                }

            }).catch((error) => {
                res.status(400).json(error)
            })



        } catch (error) {
            res.status(400).json(error)
        }

    }

    protected async atualizarTelefone(req: Request, res: Response) {

        try {

            const { telefone }: TSchemaAtualizarTelefone = req.body
            const { idUtilizador } = req.params


            SchemaAtualizarTelefone.parseAsync({
                telefone: Number(telefone)
            }).then(async (sucessovalidacao) => {



                if (idUtilizador === null) {

                    res.status(400).json(`Id do utilizador obrigatorio ${idUtilizador}`)

                } else {

                    if (idUtilizador.length >= 15) {

                        if (typeof idUtilizador === "string") {

                            const responseUtilizador = await prisma.utilizador.findUnique({
                                where: {
                                    id: idUtilizador
                                }
                            })

                            if (responseUtilizador?.id === idUtilizador) {

                                if (responseUtilizador.tipoUtilizador === "CLIENTE") {


                                    if (responseUtilizador?.telefone === sucessovalidacao.telefone) {

                                        res.status(400).json(`O número de telefone ${sucessovalidacao.telefone} já está sendo usado na aplicacao`)

                                    } else {

                                        const response = await prisma.utilizador.update({
                                            where: { id: responseUtilizador?.id },
                                            data: { telefone: sucessovalidacao.telefone }
                                        })

                                        res.status(200).json(`Número de telefone atualizado`)

                                    }



                                } else {
                                    res.status(400).json(`So o cliente podem usar essa rota...`)
                                }

                            }

                        } else {
                            res.status(400).json(`Id do utilizador inválido ${idUtilizador}`)
                        }



                    } else {
                        res.status(400).json(`Id do utilizador inválido ${idUtilizador}`)
                    }
                }




            }).catch((error) => {
                res.status(400).json(error)
            })





        } catch (error) {
            res.status(400).json(error)
        }

    }

    protected async atualizarEmail(req: Request, res: Response) {

        try {

            const { email }: TSchemaAtualizarEmail = req.body
            const { idUtilizador } = req.params


            SchemaAtualizarEmail.parseAsync({
                email: email
            }).then(async (sucessovalidacao) => {

                if (idUtilizador === null) {

                    res.status(400).json(`Id do utilizador obrigatorio ${idUtilizador}`)

                } else {

                    if (idUtilizador.length >= 15) {

                        if (typeof idUtilizador === "string") {

                            const responseUtilizador = await prisma.utilizador.findUnique({
                                where: {
                                    id: idUtilizador
                                }
                            })

                            if (responseUtilizador?.id === idUtilizador) {

                                if (responseUtilizador.tipoUtilizador === "CLIENTE") {

                                    if (responseUtilizador?.email === sucessovalidacao.email) {

                                        res.status(400).json(`O email ${sucessovalidacao.email} já está sendo usado na aplicacao`)

                                    } else {


                                        const response = await prisma.utilizador.update({
                                            where: { id: responseUtilizador?.id },
                                            data: { email: sucessovalidacao.email }
                                        })

                                        res.status(200).json(`Email atualizado`)


                                    }


                                } else {
                                    res.status(400).json(`So o cliente podem usar essa rota...`)
                                }

                            }

                        } else {
                            res.status(400).json(`Id do utilizador inválido ${idUtilizador}`)
                        }



                    } else {
                        res.status(400).json(`Id do utilizador inválido ${idUtilizador}`)
                    }
                }






            }).catch((error) => {
                res.status(400).json(error)
            })

        } catch (error) {
            res.status(400).json(error)
        }

    }

    protected async login(req: Request, res: Response) {

        try {

            const { email, palavraPasse }: TSchemaLogin = req.body

            SchemaLogin.parseAsync({
                email: email,
                palavraPasse: palavraPasse
            }).then(async (sucessoValidacao) => {

                const responseEmail = await prisma.utilizador.findUnique({
                    where: { email: email }
                })

                if (responseEmail?.email === sucessoValidacao.email) {

                    if (responseEmail.autenticado === true) {


                        if (responseEmail.tipoUtilizador === "CLIENTE") {

                            const senha_correta = await CompararPalavraPasse.comparar_palavra_passe(sucessoValidacao.palavraPasse, responseEmail.palavraPasse)

                            if (senha_correta === true) {
                                const logado = new Jwt().token_sign(responseEmail.id)
                                res.status(200).json(logado)
                            } else {
                                res.status(400).json(`A sua palavra passe está incorreta.`)
                            }

                        } else {
                            res.status(400).json(`Acesso restrito para clientes`)
                        }


                    } else {
                        res.status(400).json(`Sua conta nao esta autenticada...`)
                    }


                } else {
                    res.status(400).json(`O seu email esta invalido`)
                }

            }).catch((error) => {
                res.status(400).json(error)
            })

        } catch (error) {

        }

    }

}


export default ClienteController