/*
  Warnings:

  - You are about to drop the column `email` on the `affiliate` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `affiliate` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "affiliate_email_key";

-- AlterTable
ALTER TABLE "affiliate" DROP COLUMN "email",
DROP COLUMN "name";
