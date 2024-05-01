/*
  Warnings:

  - You are about to drop the column `datSaida` on the `reservas` table. All the data in the column will be lost.
  - Added the required column `dataSaida` to the `reservas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reservas` DROP COLUMN `datSaida`,
    ADD COLUMN `dataSaida` DATETIME(3) NOT NULL;
