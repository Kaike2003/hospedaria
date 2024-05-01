/*
  Warnings:

  - A unique constraint covering the columns `[codigo_autenticacao]` on the table `utilizadores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `utilizadores_codigo_autenticacao_key` ON `utilizadores`(`codigo_autenticacao`);
