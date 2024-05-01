import express, { Router, Response, Request } from "express"
import cors from "cors"
import morgan from "morgan"
import dotenv from "dotenv"
import AdminRouter from "../router/Admin.router"
import ClienteRouter from "../router/Cliente.router"
import FuncionalidadeRouter from "../router/Funcionalidade.router"
import taxa_limite from "express-rate-limit"
import PublicoRouter from "../router/Publico.router"


class Server {

    public app: express.Application
    public router_todas

    constructor() {
        this.app = express()
        this.middlewares()
        this.router_todas = Router()
        this.todas_rotas()
    }

    middlewares() {
        dotenv.config()
        this.app.use(express.json()).use(morgan("dev")).use(cors())
    }

    todas_rotas() {

        this.app.use("/hospedaria/admin", new AdminRouter().router_admin)
        this.app.use("/hospedaria/cliente", new ClienteRouter().router_cliente)
        this.app.use("/hospedaria/funcionalidade", new FuncionalidadeRouter().router_funcionalidade)
        this.app.use("/hospedaria/publico", new PublicoRouter().router_publico)

        this.app.get("/", (req: Request, res: Response) => {
            res.status(200).json("Rota principal funcionando...")
        })

        taxa_limite({
            windowMs: 15 * 60 * 1000, // 15 minutes
            limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
            standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
        })

    }


    listen(porta: number) {
        this.app.listen(porta, () => {
            console.log(`Servidor rodando na porta ${porta}`)
        })
    }


}


export default new Server()