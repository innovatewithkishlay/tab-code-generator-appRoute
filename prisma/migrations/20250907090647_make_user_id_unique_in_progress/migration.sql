/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_key" ON "UserProgress"("userId");
