/*
  Warnings:

  - You are about to drop the `Feedback` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Feedback";

-- CreateTable
CREATE TABLE "FeedbackAnalysis" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "satisfaction" SMALLINT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "mainPoints" TEXT[],
    "painPoints" TEXT[],
    "suggestedImprovements" TEXT[],
    "contactType" TEXT,
    "contactValue" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedbackAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureRequest" (
    "id" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "userPain" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeatureRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackAnalysis_conversationId_key" ON "FeedbackAnalysis"("conversationId");

-- CreateIndex
CREATE INDEX "FeedbackAnalysis_userId_idx" ON "FeedbackAnalysis"("userId");

-- CreateIndex
CREATE INDEX "FeedbackAnalysis_category_idx" ON "FeedbackAnalysis"("category");

-- CreateIndex
CREATE INDEX "FeedbackAnalysis_sentiment_idx" ON "FeedbackAnalysis"("sentiment");

-- CreateIndex
CREATE INDEX "FeedbackAnalysis_satisfaction_idx" ON "FeedbackAnalysis"("satisfaction");

-- CreateIndex
CREATE INDEX "FeatureRequest_status_idx" ON "FeatureRequest"("status");

-- CreateIndex
CREATE INDEX "FeatureRequest_votes_idx" ON "FeatureRequest"("votes");

-- CreateIndex
CREATE INDEX "FeatureRequest_priority_idx" ON "FeatureRequest"("priority");

-- AddForeignKey
ALTER TABLE "FeedbackAnalysis" ADD CONSTRAINT "FeedbackAnalysis_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureRequest" ADD CONSTRAINT "FeatureRequest_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "FeedbackAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
