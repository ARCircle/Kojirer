/*
  Warnings:

  - You are about to drop the column `garlic` on the `dons` table. All the data in the column will be lost.
  - You are about to drop the column `vegetable` on the `dons` table. All the data in the column will be lost.
  - Added the required column `ninniku` to the `dons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yasai` to the `dons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dons" DROP COLUMN "garlic",
DROP COLUMN "vegetable",
ADD COLUMN     "ninniku" INTEGER NOT NULL,
ADD COLUMN     "yasai" INTEGER NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
