CREATE TABLE "SalesCodexIntake" (
 "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
 "requestedByUserId" TEXT NOT NULL,
 "requestKey" TEXT NOT NULL,
 "requestText" TEXT NOT NULL,
 "routingJson" JSONB NOT NULL,
 "status" TEXT NOT NULL DEFAULT 'QUEUED',
 "lookupsJson" JSONB NOT NULL DEFAULT '[]',
 "planJson" JSONB,
 "resultJson" JSONB,
 "errorCode" TEXT,
 "leaseToken" TEXT,
 "leaseExpiresAt" TIMESTAMP(3),
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "SalesCodexIntake_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SalesCodexIntake_requestKey_key" ON "SalesCodexIntake"("requestKey");
CREATE INDEX "SalesCodexIntake_requestedByUserId_createdAt_idx" ON "SalesCodexIntake"("requestedByUserId", "createdAt");
CREATE INDEX "SalesCodexIntake_status_createdAt_idx" ON "SalesCodexIntake"("status", "createdAt");
CREATE TABLE "SalesCodexFollowup" (
 "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
 "businessKey" TEXT NOT NULL,
 "customerId" TEXT NOT NULL,
 "productId" TEXT NOT NULL,
 "kind" TEXT NOT NULL,
 "taskItemId" TEXT NOT NULL,
 "intakeId" TEXT NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "SalesCodexFollowup_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SalesCodexFollowup_businessKey_key" ON "SalesCodexFollowup"("businessKey");
CREATE UNIQUE INDEX "SalesCodexFollowup_taskItemId_key" ON "SalesCodexFollowup"("taskItemId");
CREATE INDEX "SalesCodexFollowup_customerId_productId_idx" ON "SalesCodexFollowup"("customerId", "productId");
