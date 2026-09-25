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

test("watch media conflicts with every other active watch owner", () => {
  assert.deepEqual(conflictingMediaBindingWhere(input), {
    mediaObjectId: "media-1",
    lifecycle: { not: MediaBindingLifecycle.REMOVED },
    NOT: {
      ownerType: MediaOwnerType.WATCH,
      ownerId: "watch-1",
    },
    ownerType: MediaOwnerType.WATCH,
  });
});

test("binding media realigns all active bindings for its owner before upsert", async () => {
  const calls: string[] = [];
  const db = {
    mediaBinding: {
      findUnique: async () => {
        calls.push("findUnique");
        return null;
      },
      findFirst: async () => {
        calls.push("findFirst");
        return null;
      },
      findMany: async () => {
        calls.push("findMany");
        return [{
          audienceSegment: AudienceSegment.WOMEN,
          pipelineKey: MediaPipelineKey.WOMEN_LITE,
        }];
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

  assert.deepEqual(calls, ["findUnique", "findFirst", "findMany", "updateMany", "upsert"]);
});

test("binding media skips the broad owner update when metadata is already aligned", async () => {
  let updateManyCalled = false;
  const db = {
    mediaBinding: {
      findUnique: async () => ({ id: "binding-1" }),
      findFirst: async () => null,
      findMany: async () => [{
        audienceSegment: AudienceSegment.MEN,
        pipelineKey: MediaPipelineKey.MEN_STANDARD,
      }],
      updateMany: async () => {
        updateManyCalled = true;
        return { count: 1 };
      },
      upsert: async () => ({ id: "binding-1" }),
    },
  };

  await bindMedia(input, db as never);
  assert.equal(updateManyCalled, false);
});

test("binding media rejects another watch owner even in the same segment", async () => {
  let wrote = false;
  const db = {
    mediaBinding: {
      findUnique: async () => null,
      findFirst: async () => ({
        id: "binding-2",
        ownerType: MediaOwnerType.WATCH,
        ownerId: "watch-2",
        audienceSegment: AudienceSegment.MEN,
      }),
      findMany: async () => [],
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
    /another WATCH owner \(watch-2\) in segment MEN/,
  );
  assert.equal(wrote, false);
});

test("an existing owner can update its lifecycle while historical drift is repaired", async () => {
  let conflictChecked = false;
  const db = {
    mediaBinding: {
      findUnique: async () => ({ id: "binding-1" }),
      findFirst: async () => {
        conflictChecked = true;
        return { id: "binding-2" };
      },
      findMany: async () => [],
      updateMany: async () => ({ count: 1 }),
      upsert: async () => ({ id: "binding-1" }),
    },
  };

  await bindMedia(input, db as never);
  assert.equal(conflictChecked, false);
});
