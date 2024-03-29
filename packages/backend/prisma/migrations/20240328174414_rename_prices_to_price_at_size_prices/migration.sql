/*
  Warnings:

  - You are about to drop the column `prices` on the `size_prices` table. All the data in the column will be lost.
  - Added the required column `price` to the `size_prices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "size_prices" RENAME COLUMN "prices" TO "price";
