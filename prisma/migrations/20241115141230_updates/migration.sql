/*
  Warnings:

  - The `messages` column on the `Conversation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `insights` on the `FeedbackAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `stats` on the `FeedbackAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ItemAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `feasibility` on the `ItemAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `impact` on the `ItemAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `resources` on the `ItemAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `risk` on the `ItemAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ItemAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `marketSize` on the `MarketAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `opportunities` on the `MarketAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `risks` on the `MarketAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `alternatives` on the `Recommendation` table. All the data in the column will be lost.
  - You are about to drop the column `confidenceLevel` on the `Recommendation` table. All the data in the column will be lost.
  - You are about to drop the column `decision` on the `Recommendation` table. All the data in the column will be lost.
  - You are about to drop the column `keyFactors` on the `Recommendation` table. All the data in the column will be lost.
  - You are about to drop the column `nextSteps` on the `Recommendation` table. All the data in the column will be lost.
  - You are about to drop the column `risks` on the `Recommendation` table. All the data in the column will be lost.
  - You are about to drop the column `infrastructure` on the `ResourceAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `teamsInvolved` on the `ResourceAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `training` on the `ResourceAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `confidenceLevel` on the `TeamPerspective` table. All the data in the column will be lost.
  - You are about to drop the column `constraints` on the `TeamPerspective` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedEffort` on the `TeamPerspective` table. All the data in the column will be lost.
  - You are about to drop the column `expertiseAreas` on the `TeamPerspective` table. All the data in the column will be lost.
  - You are about to drop the column `priorities` on the `TeamPerspective` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `TeamPerspective` table. All the data in the column will be lost.
  - You are about to drop the `ImplementationDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemDependency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemFeedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Milestone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResourceAllocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Roadmap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoadmapBranch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoadmapItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserImpactAnalysis` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `meta` to the `FeedbackAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `analysis` to the `ItemAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ItemAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `market_size` to the `MarketAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority_score` to the `Recommendation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proceed` to the `Recommendation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimated_cost` to the `ResourceAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `required_team_size` to the `ResourceAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resource_breakdown` to the `ResourceAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sentiment` to the `TeamPerspective` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team` to the `TeamPerspective` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DetailedAnalysis" DROP CONSTRAINT "DetailedAnalysis_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ImplementationDetails" DROP CONSTRAINT "ImplementationDetails_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "ItemAnalysis" DROP CONSTRAINT "ItemAnalysis_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemDependency" DROP CONSTRAINT "ItemDependency_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "ItemDependency" DROP CONSTRAINT "ItemDependency_targetId_fkey";

-- DropForeignKey
ALTER TABLE "ItemFeedback" DROP CONSTRAINT "ItemFeedback_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ResourceAllocation" DROP CONSTRAINT "ResourceAllocation_itemId_fkey";

-- DropForeignKey
ALTER TABLE "RoadmapBranch" DROP CONSTRAINT "RoadmapBranch_parentBranchId_fkey";

-- DropForeignKey
ALTER TABLE "RoadmapBranch" DROP CONSTRAINT "RoadmapBranch_roadmapId_fkey";

-- DropForeignKey
ALTER TABLE "RoadmapItem" DROP CONSTRAINT "RoadmapItem_branchId_fkey";

-- DropForeignKey
ALTER TABLE "RoadmapItem" DROP CONSTRAINT "RoadmapItem_roadmapId_fkey";

-- DropForeignKey
ALTER TABLE "UserImpactAnalysis" DROP CONSTRAINT "UserImpactAnalysis_analysisId_fkey";

-- DropIndex
DROP INDEX "Conversation_sessionId_idx";

-- DropIndex
DROP INDEX "Conversation_userId_idx";

-- DropIndex
DROP INDEX "DetailedAnalysis_itemId_idx";

-- DropIndex
DROP INDEX "DetailedAnalysis_timestamp_idx";

-- DropIndex
DROP INDEX "FeedbackAnalysis_isLatest_idx";

-- DropIndex
DROP INDEX "FeedbackAnalysis_timestamp_idx";

-- DropIndex
DROP INDEX "ItemAnalysis_itemId_idx";

-- DropIndex
DROP INDEX "ItemAnalysis_itemId_key";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "messages",
ADD COLUMN     "messages" JSONB[];

-- AlterTable
ALTER TABLE "FeedbackAnalysis" DROP COLUMN "insights",
DROP COLUMN "stats",
ADD COLUMN     "meta" JSONB NOT NULL,
ALTER COLUMN "isLatest" SET DEFAULT false;

-- AlterTable
ALTER TABLE "ItemAnalysis" DROP COLUMN "createdAt",
DROP COLUMN "feasibility",
DROP COLUMN "impact",
DROP COLUMN "resources",
DROP COLUMN "risk",
DROP COLUMN "updatedAt",
ADD COLUMN     "analysis" JSONB NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MarketAnalysis" DROP COLUMN "marketSize",
DROP COLUMN "opportunities",
DROP COLUMN "risks",
ADD COLUMN     "market_size" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Recommendation" DROP COLUMN "alternatives",
DROP COLUMN "confidenceLevel",
DROP COLUMN "decision",
DROP COLUMN "keyFactors",
DROP COLUMN "nextSteps",
DROP COLUMN "risks",
ADD COLUMN     "next_steps" TEXT[],
ADD COLUMN     "priority_score" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "proceed" BOOLEAN NOT NULL,
ADD COLUMN     "rationale" TEXT[];

-- AlterTable
ALTER TABLE "ResourceAnalysis" DROP COLUMN "infrastructure",
DROP COLUMN "teamsInvolved",
DROP COLUMN "training",
ADD COLUMN     "estimated_cost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "required_team_size" INTEGER NOT NULL,
ADD COLUMN     "resource_breakdown" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "TeamPerspective" DROP COLUMN "confidenceLevel",
DROP COLUMN "constraints",
DROP COLUMN "estimatedEffort",
DROP COLUMN "expertiseAreas",
DROP COLUMN "priorities",
DROP COLUMN "role",
ADD COLUMN     "sentiment" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "suggestions" TEXT[],
ADD COLUMN     "team" TEXT NOT NULL;

-- DropTable
DROP TABLE "ImplementationDetails";

-- DropTable
DROP TABLE "ItemDependency";

-- DropTable
DROP TABLE "ItemFeedback";

-- DropTable
DROP TABLE "Milestone";

-- DropTable
DROP TABLE "ResourceAllocation";

-- DropTable
DROP TABLE "Roadmap";

-- DropTable
DROP TABLE "RoadmapBranch";

-- DropTable
DROP TABLE "RoadmapItem";

-- DropTable
DROP TABLE "UserImpactAnalysis";

-- CreateTable
CREATE TABLE "FeedbackItem" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "priority" TEXT,
    "severity" TEXT,
    "status" TEXT,
    "tags" TEXT[],
    "sentiment_score" DOUBLE PRECISION,
    "first_mentioned" TIMESTAMP(3) NOT NULL,
    "last_mentioned" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedbackItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Implementation" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "technical_requirements" TEXT[],
    "dependencies" TEXT[],
    "risks" TEXT[],
    "timeline_estimate" TEXT NOT NULL,
    "complexity_score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Implementation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserImpact" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "benefits" TEXT[],
    "potential_issues" TEXT[],
    "user_segments_affected" TEXT[],
    "expected_satisfaction" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "UserImpact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ConversationToFeedbackItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Implementation_analysisId_key" ON "Implementation"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "UserImpact_analysisId_key" ON "UserImpact"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "_ConversationToFeedbackItem_AB_unique" ON "_ConversationToFeedbackItem"("A", "B");

-- CreateIndex
CREATE INDEX "_ConversationToFeedbackItem_B_index" ON "_ConversationToFeedbackItem"("B");

-- AddForeignKey
ALTER TABLE "ItemAnalysis" ADD CONSTRAINT "ItemAnalysis_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "FeedbackItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailedAnalysis" ADD CONSTRAINT "DetailedAnalysis_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "FeedbackItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Implementation" ADD CONSTRAINT "Implementation_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "DetailedAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserImpact" ADD CONSTRAINT "UserImpact_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "DetailedAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationToFeedbackItem" ADD CONSTRAINT "_ConversationToFeedbackItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationToFeedbackItem" ADD CONSTRAINT "_ConversationToFeedbackItem_B_fkey" FOREIGN KEY ("B") REFERENCES "FeedbackItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
