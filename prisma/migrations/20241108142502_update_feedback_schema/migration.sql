/*
  Warnings:

  - You are about to drop the column `contactInfo` on the `Feedback` table. All the data in the column will be lost.
  - Added the required column `conversationId` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "isAnalyzed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "contactInfo",
ADD COLUMN     "contactType" TEXT,
ADD COLUMN     "contactValue" TEXT,
ADD COLUMN     "conversationId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Feedback_conversationId_idx" ON "Feedback"("conversationId");
