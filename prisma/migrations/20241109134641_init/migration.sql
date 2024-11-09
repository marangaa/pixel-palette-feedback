/*
  Warnings:

  - You are about to drop the column `contactMethod` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `contactValue` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `featureRequests` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `keyThemes` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `painPoints` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `satisfaction` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `sentiment` on the `Conversation` table. All the data in the column will be lost.
  - Added the required column `extractedData` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Made the column `sessionId` on table `Conversation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "contactMethod",
DROP COLUMN "contactValue",
DROP COLUMN "featureRequests",
DROP COLUMN "keyThemes",
DROP COLUMN "painPoints",
DROP COLUMN "satisfaction",
DROP COLUMN "sentiment",
ADD COLUMN     "extractedData" JSONB NOT NULL,
ALTER COLUMN "sessionId" SET NOT NULL;
