-- CreateTable
CREATE TABLE "public"."DocumentHistory" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentHistory_pkey" PRIMARY KEY ("id")
);
