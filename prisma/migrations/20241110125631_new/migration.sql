/*
  Warnings:

  - You are about to drop the `FeatureAnalysis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeatureRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FeatureAnalysis" DROP CONSTRAINT "FeatureAnalysis_featureRequestId_fkey";

-- DropForeignKey
ALTER TABLE "FeatureRequest" DROP CONSTRAINT "FeatureRequest_conversationId_fkey";

-- DropTable
DROP TABLE "FeatureAnalysis";

-- DropTable
DROP TABLE "FeatureRequest";
