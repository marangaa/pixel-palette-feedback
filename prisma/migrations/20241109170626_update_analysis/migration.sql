-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "analysis" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AggregatedAnalytics" (
    "id" TEXT NOT NULL,
    "timeRange" INTEGER NOT NULL,
    "insights" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AggregatedAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureBoard" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "effort" TEXT NOT NULL,
    "analysis" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureBoard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Analysis_conversationId_key" ON "Analysis"("conversationId");

-- CreateIndex
CREATE INDEX "Analysis_timestamp_idx" ON "Analysis"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "AggregatedAnalytics_timeRange_key" ON "AggregatedAnalytics"("timeRange");

-- CreateIndex
CREATE INDEX "FeatureBoard_status_idx" ON "FeatureBoard"("status");

-- CreateIndex
CREATE INDEX "FeatureBoard_priority_idx" ON "FeatureBoard"("priority");

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
