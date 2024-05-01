"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
class Encriptar {
    palavraPasse(palavraPasse) {
        return (0, bcrypt_1.hash)(palavraPasse, 8);
    }
}
exports.default = new Encriptar();
