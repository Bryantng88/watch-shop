BEGIN;

CREATE SEQUENCE "personal_work_number_seq" AS INTEGER;

ALTER TABLE "TaskItem" ADD COLUMN "personalWorkNumber" INTEGER;

WITH numbered AS (
  SELECT item."id", row_number() OVER (ORDER BY item."createdAt", item."id") AS number
  FROM "TaskItem" item
  LEFT JOIN "Task" task ON task."id" = item."taskId"
  WHERE item."personalOwnerUserId" IS NOT NULL OR task."kind" = 'PERSONAL'
)
UPDATE "TaskItem" item SET "personalWorkNumber" = numbered.number
FROM numbered WHERE item."id" = numbered."id";

SELECT setval('"personal_work_number_seq"', COALESCE(MAX("personalWorkNumber"), 1), COUNT("personalWorkNumber") > 0)
FROM "TaskItem";

CREATE UNIQUE INDEX "TaskItem_personalWorkNumber_key" ON "TaskItem"("personalWorkNumber");

CREATE FUNCTION assign_personal_work_number() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW."personalWorkNumber" IS NULL AND (
    NEW."personalOwnerUserId" IS NOT NULL OR EXISTS (
      SELECT 1 FROM "Task" WHERE "id" = NEW."taskId" AND "kind" = 'PERSONAL'
    )
  ) THEN
    NEW."personalWorkNumber" := nextval('"personal_work_number_seq"');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER assign_personal_work_number
BEFORE INSERT OR UPDATE OF "personalOwnerUserId", "taskId" ON "TaskItem"
FOR EACH ROW EXECUTE FUNCTION assign_personal_work_number();

COMMIT;
