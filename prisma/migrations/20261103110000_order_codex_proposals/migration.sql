CREATE TABLE "OrderCodexProposal" (
 "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
 "orderId" TEXT NOT NULL,
 "requestedByUserId" TEXT NOT NULL,
 "requestKey" TEXT NOT NULL,
 "requestText" TEXT NOT NULL,
 "contextJson" JSONB NOT NULL,
 "orderVersion" TIMESTAMP(3) NOT NULL,
 "status" TEXT NOT NULL DEFAULT 'QUEUED',
 "planJson" JSONB,
 "createdTaskIds" JSONB,
 "leaseToken" TEXT,
 "leaseExpiresAt" TIMESTAMP(3),
 "errorCode" TEXT,
 "revision" INTEGER NOT NULL DEFAULT 0,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "OrderCodexProposal_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "OrderCodexProposal_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT "OrderCodexProposal_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "OrderCodexProposal_requestKey_key" ON "OrderCodexProposal"("requestKey");
CREATE INDEX "OrderCodexProposal_orderId_requestedByUserId_createdAt_idx" ON "OrderCodexProposal"("orderId","requestedByUserId","createdAt");
CREATE INDEX "OrderCodexProposal_status_createdAt_idx" ON "OrderCodexProposal"("status","createdAt");
