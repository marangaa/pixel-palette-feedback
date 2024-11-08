/*
  Warnings:

  - You are about to alter the column `satisfaction` on the `Feedback` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - Added the required column `sentiment` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "contactInfo" JSONB,
ADD COLUMN     "sentiment" TEXT NOT NULL,
ALTER COLUMN "satisfaction" SET DATA TYPE SMALLINT;

-- CreateIndex
CREATE INDEX "Conversation_timestamp_idx" ON "Conversation"("timestamp");

-- CreateIndex
CREATE INDEX "Feedback_category_idx" ON "Feedback"("category");

-- CreateIndex
CREATE INDEX "Feedback_timestamp_idx" ON "Feedback"("timestamp");
