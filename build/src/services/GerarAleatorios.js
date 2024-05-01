"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class GerarAleatorios {
    geradorStrings() {
        const tamanho_string = 8;
        const bytesAleatorios = crypto_1.default.randomBytes(tamanho_string);
        const stringAleatoria = bytesAleatorios.toString("base64");
        return stringAleatoria;
    }
}
exports.default = new GerarAleatorios();
