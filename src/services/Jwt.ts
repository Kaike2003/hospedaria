import jwt from "jsonwebtoken"

export default class Jwt {

    public token_sign(utilizador_id: string) {

        const segredo = "process.env.SECRET_JWT"

        const token = jwt.sign({
            utilizador_id: utilizador_id,
        }, segredo, { expiresIn: "5d" })

        return { token, utilizador_id }

    }

}