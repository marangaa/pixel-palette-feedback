-- CreateTable
CREATE TABLE "FeatureAnalysis" (
    "id" TEXT NOT NULL,
    "featureName" TEXT NOT NULL,
    "analysis" JSONB NOT NULL,
    "conversations" TEXT[],
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAnalyzed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mentionCount" INTEGER NOT NULL DEFAULT 0,
    "cached" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FeatureAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackAnalysis" (
    "id" TEXT NOT NULL,
    "timeRange" INTEGER NOT NULL,
    "analysis" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeatureAnalysis_featureName_key" ON "FeatureAnalysis"("featureName");

-- CreateIndex
CREATE INDEX "FeatureAnalysis_featureName_idx" ON "FeatureAnalysis"("featureName");

-- CreateIndex
CREATE INDEX "FeedbackAnalysis_timeRange_idx" ON "FeedbackAnalysis"("timeRange");
