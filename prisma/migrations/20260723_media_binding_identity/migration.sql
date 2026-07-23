DROP INDEX IF EXISTS "MediaBinding_ownerType_ownerId_role_sortOrder_key";

CREATE UNIQUE INDEX "MediaBinding_mediaObjectId_ownerType_ownerId_role_key"
ON "MediaBinding"("mediaObjectId", "ownerType", "ownerId", "role");
