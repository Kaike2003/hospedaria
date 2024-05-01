import { hash } from "bcrypt"

class Encriptar {

    palavraPasse(palavraPasse: string) {

        return hash(palavraPasse, 8)

    }

}

export default new Encriptar()