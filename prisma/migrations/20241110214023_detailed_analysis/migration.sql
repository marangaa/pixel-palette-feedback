-- CreateTable
CREATE TABLE "DetailedAnalysis" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DetailedAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketAnalysis" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "marketSize" JSONB NOT NULL,
    "competition" JSONB NOT NULL,
    "trends" JSONB NOT NULL,
    "opportunities" TEXT[],
    "risks" TEXT[],

    CONSTRAINT "MarketAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamPerspective" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "concerns" TEXT[],
    "priorities" TEXT[],
    "constraints" TEXT[],
    "expertiseAreas" TEXT[],
    "confidenceLevel" DOUBLE PRECISION NOT NULL,
    "estimatedEffort" JSONB NOT NULL,

    CONSTRAINT "TeamPerspective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImplementationDetails" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "technical" JSONB NOT NULL,
    "business" JSONB NOT NULL,
    "timeline" JSONB NOT NULL,
    "dependencies" JSONB NOT NULL,

    CONSTRAINT "ImplementationDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserImpactAnalysis" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "segmentsAffected" JSONB NOT NULL,
    "adoptionPrediction" JSONB NOT NULL,
    "feedbackAnalysis" JSONB NOT NULL,

    CONSTRAINT "UserImpactAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceAnalysis" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "teamsInvolved" JSONB NOT NULL,
    "infrastructure" JSONB NOT NULL,
    "training" JSONB NOT NULL,

    CONSTRAINT "ResourceAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "confidenceLevel" DOUBLE PRECISION NOT NULL,
    "keyFactors" TEXT[],
    "nextSteps" TEXT[],
    "alternatives" TEXT[],
    "risks" TEXT[],

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DetailedAnalysis_itemId_key" ON "DetailedAnalysis"("itemId");

-- CreateIndex
CREATE INDEX "DetailedAnalysis_itemId_idx" ON "DetailedAnalysis"("itemId");

-- CreateIndex
CREATE INDEX "DetailedAnalysis_timestamp_idx" ON "DetailedAnalysis"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "MarketAnalysis_analysisId_key" ON "MarketAnalysis"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "ImplementationDetails_analysisId_key" ON "ImplementationDetails"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "UserImpactAnalysis_analysisId_key" ON "UserImpactAnalysis"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceAnalysis_analysisId_key" ON "ResourceAnalysis"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "Recommendation_analysisId_key" ON "Recommendation"("analysisId");

-- AddForeignKey
ALTER TABLE "DetailedAnalysis" ADD CONSTRAINT "DetailedAnalysis_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "RoadmapItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketAnalysis" ADD CONSTRAINT "MarketAnalysis_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "DetailedAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPerspective" ADD CONSTRAINT "TeamPerspective_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "DetailedAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImplementationDetails" ADD CONSTRAINT "ImplementationDetails_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "DetailedAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserImpactAnalysis" ADD CONSTRAINT "UserImpactAnalysis_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "DetailedAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceAnalysis" ADD CONSTRAINT "ResourceAnalysis_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "DetailedAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "DetailedAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
