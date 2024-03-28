/*
  Warnings:

  - Added the required column `prices` to the `size_prices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `since` to the `size_prices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "size_prices" ADD COLUMN     "prices" INTEGER NOT NULL,
ADD COLUMN     "since" TIMESTAMP(3) NOT NULL;
