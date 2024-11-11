-- AlterTable
ALTER TABLE "FeatureRequest" ADD COLUMN     "assignedTo" TEXT,
ADD COLUMN     "complexity" TEXT NOT NULL DEFAULT 'medium',
ADD COLUMN     "metrics" JSONB,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'medium',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'backlog';

-- CreateIndex
CREATE INDEX "FeatureRequest_status_idx" ON "FeatureRequest"("status");
