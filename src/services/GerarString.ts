import crypto from "crypto"

class GerarString {

    public geradorStrings() {

        const tamanho_string = 8
        const bytesAleatorios = crypto.randomBytes(tamanho_string)
        const stringAleatoria = bytesAleatorios.toString("base64")

        return stringAleatoria
    }

}

export default new GerarString()


