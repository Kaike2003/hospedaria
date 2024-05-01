"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
class CompararPalavraPasse {
    comparar_palavra_passe(palavra_passe_atual, palavra_passe_base_dados) {
        return __awaiter(this, void 0, void 0, function* () {
            const palavra_passe_correta = bcrypt_1.default.compareSync(palavra_passe_atual, palavra_passe_base_dados);
            if (!palavra_passe_correta) {
                return (`A palavra passe ${palavra_passe_atual} está incorreta.`);
            }
            else {
                return palavra_passe_correta;
            }
        });
    }
}
exports.default = new CompararPalavraPasse();
