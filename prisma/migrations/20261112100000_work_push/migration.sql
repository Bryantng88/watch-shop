ALTER TABLE "TaskItem" ADD COLUMN "reminderMinutes" INTEGER DEFAULT 0;
ALTER TABLE "Notification" ADD COLUMN "dedupeKey" TEXT;
CREATE UNIQUE INDEX "Notification_dedupeKey_key" ON "Notification"("dedupeKey");
CREATE TABLE "WorkPushDelivery" (
 "id" TEXT PRIMARY KEY, "notificationKey" TEXT NOT NULL, "userId" TEXT NOT NULL,
 "taskItemId" TEXT, "kind" TEXT NOT NULL, "route" TEXT NOT NULL, "endpoint" TEXT NOT NULL,
 "subscriptionVersion" TIMESTAMP(3) NOT NULL, "attempts" INTEGER NOT NULL DEFAULT 0,
 "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "leaseUntil" TIMESTAMP(3),
 "deliveredAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "WorkPushDelivery_notificationKey_endpoint_key" ON "WorkPushDelivery"("notificationKey", "endpoint");
CREATE INDEX "WorkPushDelivery_deliveredAt_availableAt_leaseUntil_idx" ON "WorkPushDelivery"("deliveredAt", "availableAt", "leaseUntil");
