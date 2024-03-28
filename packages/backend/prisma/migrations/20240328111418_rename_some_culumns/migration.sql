/*
  Warnings:

  - You are about to drop the column `vegetables` on the `dons` table. All the data in the column will be lost.
  - You are about to drop the column `until` on the `topping_prices` table. All the data in the column will be lost.
  - Added the required column `vegetable` to the `dons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `since` to the `topping_prices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dons" RENAME COLUMN "vegetables"
TO "vegetable";

-- AlterTable
ALTER TABLE "topping_prices" RENAME COLUMN "until"
TO "since";
