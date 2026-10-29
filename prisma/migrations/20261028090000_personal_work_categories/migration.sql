CREATE TABLE "PersonalWorkCategory" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "color" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PersonalWorkCategory_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PersonalWorkCategory_userId_key_key" ON "PersonalWorkCategory"("userId", "key");
ALTER TABLE "PersonalWorkCategory" ADD CONSTRAINT "PersonalWorkCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TaskItem" ADD COLUMN "personalCategoryId" TEXT;
CREATE INDEX "TaskItem_personalCategoryId_idx" ON "TaskItem"("personalCategoryId");
ALTER TABLE "TaskItem" ADD CONSTRAINT "TaskItem_personalCategoryId_fkey" FOREIGN KEY ("personalCategoryId") REFERENCES "PersonalWorkCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
