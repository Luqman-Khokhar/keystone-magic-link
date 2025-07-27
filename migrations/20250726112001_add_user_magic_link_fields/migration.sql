-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL DEFAULT '',
    "listKey" TEXT NOT NULL DEFAULT '',
    "data" JSONB,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
