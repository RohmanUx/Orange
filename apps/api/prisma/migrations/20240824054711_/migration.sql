/*
  Warnings:

  - Made the column `balance` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` ALTER COLUMN `points` DROP DEFAULT,
    MODIFY `balance` INTEGER NOT NULL DEFAULT 0;
