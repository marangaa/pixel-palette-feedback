/*
  Warnings:

  - You are about to drop the `AggregatedAnalytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Analysis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeatureBoard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_conversationId_fkey";

-- DropTable
DROP TABLE "AggregatedAnalytics";

-- DropTable
DROP TABLE "Analysis";

-- DropTable
DROP TABLE "FeatureBoard";
