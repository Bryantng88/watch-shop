CREATE TABLE "BenPushSubscription" (
    "endpoint" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BenPushSubscription_pkey" PRIMARY KEY ("endpoint"),
    CONSTRAINT "BenPushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "BenPushSubscription_userId_updatedAt_idx" ON "BenPushSubscription"("userId", "updatedAt");
