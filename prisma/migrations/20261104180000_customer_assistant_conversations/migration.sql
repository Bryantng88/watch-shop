CREATE TABLE "CustomerAssistantConversation" (
  "id" TEXT NOT NULL,
  "ownerId" TEXT NOT NULL,
  "firstRequestKey" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'QUEUED',
  "revision" INTEGER NOT NULL DEFAULT 1,
  "approvedRevision" INTEGER,
  "approvedAt" TIMESTAMP(3),
  "state" JSONB NOT NULL,
  "evidence" JSONB NOT NULL DEFAULT '[]',
  "plan" JSONB,
  "leaseToken" TEXT,
  "leaseExpiresAt" TIMESTAMP(3),
  "errorCode" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CustomerAssistantConversation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CustomerAssistantConversation_owner_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT
);
CREATE UNIQUE INDEX "CustomerAssistantConversation_firstRequestKey_key" ON "CustomerAssistantConversation"("firstRequestKey");
CREATE INDEX "CustomerAssistantConversation_ownerId_updatedAt_idx" ON "CustomerAssistantConversation"("ownerId", "updatedAt");
CREATE INDEX "CustomerAssistantConversation_status_createdAt_idx" ON "CustomerAssistantConversation"("status", "createdAt");
