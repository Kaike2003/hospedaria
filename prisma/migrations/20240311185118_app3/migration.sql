/*
  Warnings:

  - Added the required column `codigo_autenticacao` to the `utilizadores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `utilizadores` ADD COLUMN `codigo_autenticacao` VARCHAR(191) NOT NULL;
