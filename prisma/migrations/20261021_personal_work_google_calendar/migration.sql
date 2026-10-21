CREATE TABLE "GoogleCalendarConnection" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "userId" TEXT NOT NULL,
    "googleAccountEmail" TEXT,
    "calendarId" TEXT NOT NULL DEFAULT 'primary',
    "accessTokenCipher" TEXT NOT NULL,
    "refreshTokenCipher" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GoogleCalendarConnection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PersonalTaskCalendarLink" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "userId" TEXT NOT NULL,
    "taskItemId" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "calendarId" TEXT NOT NULL DEFAULT 'primary',
    "eventId" TEXT NOT NULL,
    "eventHtmlLink" TEXT,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PersonalTaskCalendarLink_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GoogleCalendarConnection_userId_key" ON "GoogleCalendarConnection"("userId");
CREATE INDEX "GoogleCalendarConnection_tokenExpiresAt_idx" ON "GoogleCalendarConnection"("tokenExpiresAt");
CREATE UNIQUE INDEX "PersonalTaskCalendarLink_userId_taskItemId_key" ON "PersonalTaskCalendarLink"("userId", "taskItemId");
CREATE UNIQUE INDEX "PersonalTaskCalendarLink_connectionId_calendarId_eventId_key" ON "PersonalTaskCalendarLink"("connectionId", "calendarId", "eventId");
CREATE INDEX "PersonalTaskCalendarLink_taskItemId_idx" ON "PersonalTaskCalendarLink"("taskItemId");

ALTER TABLE "GoogleCalendarConnection" ADD CONSTRAINT "GoogleCalendarConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PersonalTaskCalendarLink" ADD CONSTRAINT "PersonalTaskCalendarLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PersonalTaskCalendarLink" ADD CONSTRAINT "PersonalTaskCalendarLink_taskItemId_fkey" FOREIGN KEY ("taskItemId") REFERENCES "TaskItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PersonalTaskCalendarLink" ADD CONSTRAINT "PersonalTaskCalendarLink_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "GoogleCalendarConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
