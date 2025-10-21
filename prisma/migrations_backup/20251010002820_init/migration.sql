-- CreateTable
CREATE TABLE "CvDraft" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CvDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LetterDraft" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LetterDraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CvDraft_userId_updatedAt_idx" ON "CvDraft"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "LetterDraft_userId_updatedAt_idx" ON "LetterDraft"("userId", "updatedAt");

