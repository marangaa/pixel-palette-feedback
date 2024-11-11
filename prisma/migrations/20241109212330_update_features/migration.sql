-- CreateTable
CREATE TABLE "FeatureRequest" (
    "id" TEXT NOT NULL,
    "featureName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,

    CONSTRAINT "FeatureRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureAnalysis" (
    "id" TEXT NOT NULL,
    "featureRequestId" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "analysisData" JSONB NOT NULL,
    "marketContext" JSONB NOT NULL,
    "businessImpact" JSONB NOT NULL,
    "implementation" JSONB NOT NULL,
    "userFeedback" JSONB[],
    "metrics" JSONB NOT NULL,

    CONSTRAINT "FeatureAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeatureRequest_featureName_idx" ON "FeatureRequest"("featureName");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureAnalysis_featureRequestId_key" ON "FeatureAnalysis"("featureRequestId");

-- CreateIndex
CREATE INDEX "FeatureAnalysis_lastUpdated_idx" ON "FeatureAnalysis"("lastUpdated");

-- AddForeignKey
ALTER TABLE "FeatureRequest" ADD CONSTRAINT "FeatureRequest_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureAnalysis" ADD CONSTRAINT "FeatureAnalysis_featureRequestId_fkey" FOREIGN KEY ("featureRequestId") REFERENCES "FeatureRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
