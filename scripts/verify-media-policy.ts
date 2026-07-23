import assert from "node:assert/strict";
import { mediaPathPolicy } from "../src/domains/media/core/media-path.policy";
import { mediaSourceRoot } from "../src/domains/media/core/media-source-path";
import { getMediaPipelineProfile } from "../src/domains/media/pipeline/media-pipeline.profile";

const menInline = mediaSourceRoot("MEN", "inline");
const womenInline = mediaSourceRoot("WOMEN", "inline");
const menEdit = mediaSourceRoot("MEN", "edit");
const womenEdit = mediaSourceRoot("WOMEN", "edit");

assert.notEqual(menInline, womenInline);
assert.notEqual(menEdit, womenEdit);
assert.equal(mediaPathPolicy.isSource(`${womenInline}/sample.jpg`), true);

const womenPipeline = getMediaPipelineProfile("WOMEN_LITE");
assert.deepEqual(womenPipeline.stages, ["photography", "publish"]);
assert.equal(womenPipeline.requiredRoles.includes("INLINE"), false);

const canonical = mediaPathPolicy.canonicalOriginal({
  mediaObjectId: "stable-object",
  filename: "watch.jpg",
});
assert.equal(canonical.includes("/men/"), false);
assert.equal(canonical.includes("/women/"), false);
assert.notEqual(
  mediaPathPolicy.exportPrefix({ segment: "MEN", productCode: "W-001" }),
  mediaPathPolicy.exportPrefix({ segment: "WOMEN", productCode: "W-001" }),
);

console.log(
  JSON.stringify(
    {
  source: { menInline, womenInline, menEdit, womenEdit },
      womenPipeline,
      canonical,
      exports: {
        men: mediaPathPolicy.exportPrefix({ segment: "MEN", productCode: "W-001" }),
        women: mediaPathPolicy.exportPrefix({
          segment: "WOMEN",
          productCode: "W-001",
        }),
      },
    },
    null,
    2,
  ),
);
