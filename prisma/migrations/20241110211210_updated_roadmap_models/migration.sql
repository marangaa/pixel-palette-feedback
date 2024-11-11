-- CreateTable
CREATE TABLE "RoadmapItem" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timeframe" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "effort" DOUBLE PRECISION NOT NULL,
    "assignedTeam" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "branchId" TEXT,

    CONSTRAINT "RoadmapItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapBranch" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL,
    "parentBranchId" TEXT,
    "roadmapId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "conditionType" TEXT,
    "conditionValue" TEXT,

    CONSTRAINT "RoadmapBranch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemDependency" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "ItemDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemAnalysis" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "feasibility" DOUBLE PRECISION NOT NULL,
    "impact" DOUBLE PRECISION NOT NULL,
    "risk" DOUBLE PRECISION NOT NULL,
    "resources" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemFeedback" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "requestCount" INTEGER NOT NULL,
    "avgSentiment" DOUBLE PRECISION NOT NULL,
    "userSegments" TEXT[],
    "keyThemes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceAllocation" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "allocation" DOUBLE PRECISION NOT NULL,
    "capacity" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roadmap" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "constraints" JSONB NOT NULL,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoadmapItem_roadmapId_idx" ON "RoadmapItem"("roadmapId");

-- CreateIndex
CREATE INDEX "RoadmapItem_status_idx" ON "RoadmapItem"("status");

-- CreateIndex
CREATE INDEX "RoadmapItem_timeframe_idx" ON "RoadmapItem"("timeframe");

-- CreateIndex
CREATE INDEX "RoadmapBranch_roadmapId_idx" ON "RoadmapBranch"("roadmapId");

-- CreateIndex
CREATE INDEX "Milestone_itemId_idx" ON "Milestone"("itemId");

-- CreateIndex
CREATE INDEX "Milestone_startDate_endDate_idx" ON "Milestone"("startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "ItemDependency_sourceId_targetId_key" ON "ItemDependency"("sourceId", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemAnalysis_itemId_key" ON "ItemAnalysis"("itemId");

-- CreateIndex
CREATE INDEX "ItemAnalysis_itemId_idx" ON "ItemAnalysis"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemFeedback_itemId_key" ON "ItemFeedback"("itemId");

-- CreateIndex
CREATE INDEX "ItemFeedback_itemId_idx" ON "ItemFeedback"("itemId");

-- CreateIndex
CREATE INDEX "ResourceAllocation_itemId_idx" ON "ResourceAllocation"("itemId");

-- CreateIndex
CREATE INDEX "ResourceAllocation_teamId_idx" ON "ResourceAllocation"("teamId");

-- CreateIndex
CREATE INDEX "ResourceAllocation_startDate_endDate_idx" ON "ResourceAllocation"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "Roadmap_isActive_idx" ON "Roadmap"("isActive");

-- AddForeignKey
ALTER TABLE "RoadmapItem" ADD CONSTRAINT "RoadmapItem_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapItem" ADD CONSTRAINT "RoadmapItem_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "RoadmapBranch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapBranch" ADD CONSTRAINT "RoadmapBranch_parentBranchId_fkey" FOREIGN KEY ("parentBranchId") REFERENCES "RoadmapBranch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapBranch" ADD CONSTRAINT "RoadmapBranch_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "RoadmapItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemDependency" ADD CONSTRAINT "ItemDependency_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "RoadmapItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemDependency" ADD CONSTRAINT "ItemDependency_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "RoadmapItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemAnalysis" ADD CONSTRAINT "ItemAnalysis_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "RoadmapItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemFeedback" ADD CONSTRAINT "ItemFeedback_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "RoadmapItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceAllocation" ADD CONSTRAINT "ResourceAllocation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "RoadmapItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
