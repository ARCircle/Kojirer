/*
  Warnings:

  - Made the column `available` on table `customizes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "customizes" ALTER COLUMN "available" SET NOT NULL;
