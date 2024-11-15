/*
  Warnings:

  - You are about to drop the column `extractedData` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the `Analysis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeedbackItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Implementation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemAnalysis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MarketAnalysis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recommendation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResourceAnalysis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamPerspective` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserImpact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ConversationToFeedbackItem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sessionId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `messages` on the `Conversation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "DetailedAnalysis" DROP CONSTRAINT "DetailedAnalysis_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Implementation" DROP CONSTRAINT "Implementation_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "ItemAnalysis" DROP CONSTRAINT "ItemAnalysis_itemId_fkey";

-- DropForeignKey
ALTER TABLE "MarketAnalysis" DROP CONSTRAINT "MarketAnalysis_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "Recommendation" DROP CONSTRAINT "Recommendation_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "ResourceAnalysis" DROP CONSTRAINT "ResourceAnalysis_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "TeamPerspective" DROP CONSTRAINT "TeamPerspective_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "UserImpact" DROP CONSTRAINT "UserImpact_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationToFeedbackItem" DROP CONSTRAINT "_ConversationToFeedbackItem_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationToFeedbackItem" DROP CONSTRAINT "_ConversationToFeedbackItem_B_fkey";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "extractedData",
DROP COLUMN "messages",
ADD COLUMN     "messages" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "FeedbackAnalysis" ADD COLUMN     "insights" JSONB,
ADD COLUMN     "stats" JSONB;

-- DropTable
DROP TABLE "DetailedAnalysis";

-- DropTable
DROP TABLE "FeedbackItem";

-- DropTable
DROP TABLE "Implementation";

-- DropTable
DROP TABLE "ItemAnalysis";

-- DropTable
DROP TABLE "MarketAnalysis";

-- DropTable
DROP TABLE "Recommendation";

-- DropTable
DROP TABLE "ResourceAnalysis";

-- DropTable
DROP TABLE "TeamPerspective";

-- DropTable
DROP TABLE "UserImpact";

-- DropTable
DROP TABLE "_ConversationToFeedbackItem";

-- CreateTable
CREATE TABLE "ExtractedData" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "satisfaction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "painPoints" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featureRequests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "contact" JSONB,
    "sentiment" TEXT NOT NULL DEFAULT 'neutral',
    "keyThemes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExtractedData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisResult" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "shouldEnd" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT NOT NULL,
    "missingElements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "nextQuestion" TEXT,
    "collectedInfo" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalysisResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExtractedData_conversationId_key" ON "ExtractedData"("conversationId");

-- CreateIndex
CREATE INDEX "ExtractedData_sentiment_idx" ON "ExtractedData"("sentiment");

-- CreateIndex
CREATE INDEX "AnalysisResult_conversationId_idx" ON "AnalysisResult"("conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_sessionId_key" ON "Conversation"("sessionId");

-- CreateIndex
CREATE INDEX "Conversation_userId_idx" ON "Conversation"("userId");

-- CreateIndex
CREATE INDEX "Conversation_timestamp_idx" ON "Conversation"("timestamp");

-- CreateIndex
CREATE INDEX "FeedbackAnalysis_timeRange_idx" ON "FeedbackAnalysis"("timeRange");

-- CreateIndex
CREATE INDEX "FeedbackAnalysis_isLatest_idx" ON "FeedbackAnalysis"("isLatest");

-- CreateIndex
CREATE INDEX "FeedbackAnalysis_timestamp_idx" ON "FeedbackAnalysis"("timestamp");

-- AddForeignKey
ALTER TABLE "ExtractedData" ADD CONSTRAINT "ExtractedData_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisResult" ADD CONSTRAINT "AnalysisResult_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
