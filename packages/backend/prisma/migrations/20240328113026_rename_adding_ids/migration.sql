/*
  Warnings:

  - The primary key for the `adding` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dons_id` on the `adding` table. All the data in the column will be lost.
  - You are about to drop the column `toppings_id` on the `adding` table. All the data in the column will be lost.
  - Added the required column `don_id` to the `adding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topping_id` to the `adding` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "adding" DROP CONSTRAINT "adding_dons_id_fkey";

-- DropForeignKey
ALTER TABLE "adding" DROP CONSTRAINT "adding_toppings_id_fkey";

-- AlterTable
ALTER TABLE "adding" RENAME COLUMN "dons_id" TO "don_id";
ALTER TABLE "adding" RENAME COLUMN "toppings_id" TO "topping_id";

-- AddForeignKey
ALTER TABLE "adding" ADD CONSTRAINT "adding_don_id_fkey" FOREIGN KEY ("don_id") REFERENCES "dons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adding" ADD CONSTRAINT "adding_topping_id_fkey" FOREIGN KEY ("topping_id") REFERENCES "toppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
