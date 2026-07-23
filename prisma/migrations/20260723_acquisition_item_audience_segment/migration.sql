ALTER TABLE "AcquisitionItem"
ADD COLUMN "audienceSegment" "AudienceSegment" NOT NULL DEFAULT 'MEN';

CREATE INDEX "AcquisitionItem_audienceSegment_idx"
ON "AcquisitionItem"("audienceSegment");
