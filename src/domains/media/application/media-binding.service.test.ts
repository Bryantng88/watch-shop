import assert from "node:assert/strict";
import test from "node:test";

import {
  AudienceSegment,
  MediaBindingLifecycle,
  MediaOwnerType,
  MediaPipelineKey,
  MediaRole,
} from "@prisma/client";

import {
  activeMediaBindingsForOwnerWhere,
  bindMedia,
  conflictingMediaBindingWhere,
  type BindMediaInput,
} from "./media-binding.service";

const input: BindMediaInput = {
  mediaObjectId: "media-1",
  ownerType: MediaOwnerType.WATCH,
  ownerId: "watch-1",
  role: MediaRole.GALLERY,
  sortOrder: 2,
  audienceSegment: AudienceSegment.MEN,
  pipelineKey: MediaPipelineKey.MEN_STANDARD,
  lifecycle: MediaBindingLifecycle.ATTACHED,
};

test("segment conflicts exclude active bindings owned by the same owner", () => {
  assert.deepEqual(conflictingMediaBindingWhere(input), {
    mediaObjectId: "media-1",
    audienceSegment: { not: AudienceSegment.MEN },
    lifecycle: { not: MediaBindingLifecycle.REMOVED },
    NOT: {
      ownerType: MediaOwnerType.WATCH,
      ownerId: "watch-1",
    },
  });
});

test("binding media realigns all active bindings for its owner before upsert", async () => {
  const calls: string[] = [];
  const db = {
    mediaBinding: {
      findFirst: async () => {
        calls.push("findFirst");
        return null;
      },
      updateMany: async (args: unknown) => {
        calls.push("updateMany");
        assert.deepEqual(args, {
          where: activeMediaBindingsForOwnerWhere(input),
          data: {
            audienceSegment: AudienceSegment.MEN,
            pipelineKey: MediaPipelineKey.MEN_STANDARD,
          },
        });
        return { count: 3 };
      },
      upsert: async () => {
        calls.push("upsert");
        return { id: "binding-1" };
      },
    },
  };

  await bindMedia(input, db as never);

  assert.deepEqual(calls, ["findFirst", "updateMany", "upsert"]);
});

test("binding media still rejects a conflicting owner in another segment", async () => {
  let wrote = false;
  const db = {
    mediaBinding: {
      findFirst: async () => ({
        id: "binding-2",
        ownerType: MediaOwnerType.WATCH,
        ownerId: "watch-2",
        audienceSegment: AudienceSegment.UNISEX,
      }),
      updateMany: async () => {
        wrote = true;
      },
      upsert: async () => {
        wrote = true;
      },
    },
  };

  await assert.rejects(
    () => bindMedia(input, db as never),
    /another WATCH owner in segment UNISEX/,
  );
  assert.equal(wrote, false);
});
