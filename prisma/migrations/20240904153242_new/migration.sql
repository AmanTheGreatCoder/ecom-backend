/*
  Warnings:

  - Added the required column `link` to the `affiliate_link` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "affiliate_link" ADD COLUMN     "link" TEXT NOT NULL;
