-- AlterTable
ALTER TABLE `quartos` ADD COLUMN `aprovado` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `publicado` BOOLEAN NOT NULL DEFAULT false;
