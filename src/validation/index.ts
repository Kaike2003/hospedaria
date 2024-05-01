import z from "zod"

const data = new Date()

export const SchemaCriarConta = z.object({
    nome: z.string().min(4).max(50),
    email: z.string().email(),
    telefone: z.number().min(111111111).max(999999999),
    palavraPasse: z.string().min(4).max(40),
    data_nascimento: z.date().min(new Date(`1500-01-01`)).max(new Date(`2014-01-01`))
})

export const SchemaRecuperarPalavraPasse = z.object({
    email: z.string().email(),
})

export const SchemaAtualizarPalavraPasse = z.object({
    palavraPasseAntiga: z.string().min(4).max(50),
    palavraPasseNova: z.string().min(4).max(50),
})

export const SchemaAutenticarConta = z.object({
    codigo: z.string().min(6)
})

export const SchemaAtualizarInformacaoPerfil = z.object({
    nome: z.string().min(4).max(50),
    data_nascimento: z.date().min(new Date(`1500-01-01`)).max(new Date(`2014-01-01`))
})

export const SchemaAtualizarTelefone = z.object({
    telefone: z.number().min(111111111).max(999999999),
})

export const SchemaAtualizarEmail = z.object({
    email: z.string().email(),
})

export const SchemaQuarto = z.object({
    nome: z.string().min(4).max(50),
    preco: z.number().min(1).max(1000000000),
    tipo_quarto: z.string().min(3).max(10),
    descricao: z.string().min(3).max(500),
    email: z.string().email()
})

export const SchemacriarReserva = z.object({
    dataEntrada: z.date().min(new Date()).max(new Date(`${data.getFullYear() + 1}-01-01`)),
    dataSaida: z.date().min(new Date()).max(new Date(`${data.getFullYear() + 1}-01-01`)),
    email: z.string().email()
})

export const SchemaLogin = z.object({
    email: z.string().email(),
    palavraPasse: z.string()
})

export const SchemaListarReservas = z.object({
    email: z.string().email(),
})

export const SchemaAvaliacao = z.object({
    email: z.string().email(),
    mensagem: z.string().min(10).max(10000)
})

export const SchemaOmitMensagemAvalicao = SchemaAvaliacao.omit({ mensagem: true })

export type TSchemaCriarConta = z.infer<typeof SchemaCriarConta>
export type TSchemaRecuperarPalavraPasse = z.infer<typeof SchemaRecuperarPalavraPasse>
export type TSchemaAtualizarPalavraPasse = z.infer<typeof SchemaAtualizarPalavraPasse>
export type TSchemaAutenticarConta = z.infer<typeof SchemaAutenticarConta>
export type TSchemaAtualizarInformacaoPerfil = z.infer<typeof SchemaAtualizarInformacaoPerfil>
export type TSchemaAtualizarTelefone = z.infer<typeof SchemaAtualizarTelefone>
export type TSchemaAtualizarEmail = z.infer<typeof SchemaAtualizarEmail>
export type TSchemaQuarto = z.infer<typeof SchemaQuarto>
export type TSchemacriarReserva = z.infer<typeof SchemacriarReserva>
export type TSchemaLogin = z.infer<typeof SchemaLogin>
export type TSchemaListarReservas = z.infer<typeof SchemaListarReservas>
export type TSchemaAvaliacao = z.infer<typeof SchemaAvaliacao>
export type TSchemaListarAvaliacao = z.infer<typeof SchemaOmitMensagemAvalicao>