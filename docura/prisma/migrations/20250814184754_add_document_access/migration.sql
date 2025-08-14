-- CreateEnum
CREATE TYPE "public"."AccessRole" AS ENUM ('viewer', 'commenter', 'editor');

-- CreateTable
CREATE TABLE "public"."DocumentAccess" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "userId" TEXT,
    "role" "public"."AccessRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentHistoryId" TEXT,

    CONSTRAINT "DocumentAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DocumentAccess_documentId_idx" ON "public"."DocumentAccess"("documentId");

-- CreateIndex
CREATE INDEX "DocumentAccess_userId_idx" ON "public"."DocumentAccess"("userId");

-- AddForeignKey
ALTER TABLE "public"."DocumentAccess" ADD CONSTRAINT "DocumentAccess_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "public"."Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentAccess" ADD CONSTRAINT "DocumentAccess_documentHistoryId_fkey" FOREIGN KEY ("documentHistoryId") REFERENCES "public"."DocumentHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
