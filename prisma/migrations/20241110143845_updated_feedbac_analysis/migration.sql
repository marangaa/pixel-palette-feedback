-- CreateTable
CREATE TABLE "FeedbackAnalysis" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeRange" INTEGER NOT NULL,
    "categories" JSONB NOT NULL,
    "insights" JSONB NOT NULL,
    "stats" JSONB NOT NULL,
    "isLatest" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FeedbackAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeedbackAnalysis_timestamp_idx" ON "FeedbackAnalysis"("timestamp");

-- CreateIndex
CREATE INDEX "FeedbackAnalysis_isLatest_idx" ON "FeedbackAnalysis"("isLatest");
