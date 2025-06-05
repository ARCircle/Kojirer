/*
  Warnings:

  - The primary key for the `options` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `options` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "options" DROP CONSTRAINT "options_pkey",
ALTER COLUMN "id" SET DATA TYPE Integer,
ADD CONSTRAINT "options_pkey" PRIMARY KEY ("id");
