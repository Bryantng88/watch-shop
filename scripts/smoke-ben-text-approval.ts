import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { lookupMediaWatches, recheckMediaPost } from "../src/domains/ai-assistant/server/media-post-plan";
import { codeCommand } from "../src/domains/ai-assistant/server/code-jobs";
import { prisma } from "../src/server/db/client";
import { PERMISSIONS } from "../src/constants/permissions";
import {
  cancelAssistant,
  sendAssistant,
  assistantWorker,
  listAssistant,
  approveAssistantPersonalWork,
} from "../src/domains/ai-assistant/server/service";
import { assistantActor } from "../src/domains/ai-assistant/server/access";
import { createPersonalWorkItem } from "../src/domains/personal-work/server/personal-work.service";
import { ensureOperationSpace } from "../src/domains/coordination/server/operation-space.service";
import { mediaStorage } from "../src/domains/media/storage";
import type { Conversation } from "../src/domains/ai-assistant/simulation";
import type { PersonalWorkPlan } from "../src/domains/ai-assistant/personal-work-contract";

async function main() {
  const database = new URL(process.env.DATABASE_URL || "");
  assert.equal(database.hostname, "127.0.0.1");
  assert.equal(database.pathname, "/personal_codex_test");
  assert.equal(process.env.S3_BUCKET, "synthetic-text-review-media");
  assert.equal(
    await prisma.customerAssistantConversation.count({
      where: { status: { in: ["QUEUED", "RUNNING"] } },
    }),
    0,
  );
  const suffix = randomUUID(),
    oldQuota = process.env.CUSTOMER_AI_MAX_TURNS_PER_HOUR,
    oldContact = process.env.CUSTOMER_AI_PERMISSION_CONTACT_USER_ID;
  process.env.CUSTOMER_AI_MAX_TURNS_PER_HOUR = "100";
  for (const code of Object.values(PERMISSIONS))
    await prisma.permission.upsert({
      where: { code },
      create: { code },
      update: {},
    });
  const role = await prisma.role.create({
    data: {
      name: `text-review-${suffix}`,
      permissions: {
        connect: Object.values(PERMISSIONS).map((code) => ({ code })),
      },
    },
  });
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    create: { name: "ADMIN" },
    update: {},
  });
  const owner = await prisma.user.create({
    data: {
      name: "Synthetic text owner",
      email: `text-owner-${suffix}@example.invalid`,
      roles: { connect: { id: role.id } },
    },
  });
  const contact = await prisma.user.create({
    data: {
      name: "Synthetic contact",
      email: `text-contact-${suffix}@example.invalid`,
      roles: { connect: { id: adminRole.id } },
    },
  });
  const staff = await prisma.user.create({
    data: {
      name: "Synthetic staff",
      email: `text-staff-${suffix}@example.invalid`,
    },
  });
  process.env.CUSTOMER_AI_PERMISSION_CONTACT_USER_ID = contact.id;
  const methods = [
    "exists",
    "stat",
    "read",
    "write",
    "copy",
    "move",
    "delete",
    "sign",
    "list",
  ] as const;
  const storageOriginals = Object.fromEntries(
    methods.map((key) => [key, mediaStorage[key]]),
  );
  const storageKeys = new Set<string>();
  let copies = 0;
  const metadata = (key: string) => ({
    key,
    sizeBytes: 100,
    etag: "synthetic",
    contentType: "image/jpeg",
  });
  for (const key of methods)
    (mediaStorage as unknown as Record<string, unknown>)[key] = async () => {
      throw Error("Unexpected storage operation in isolated fixture");
    };
  mediaStorage.stat = async (key) =>
    storageKeys.has(key) ? metadata(key) : null;
  mediaStorage.copy = async (from, to) => {
    assert.ok(storageKeys.has(from));
    storageKeys.add(to);
    copies++;
    return metadata(to);
  };
  mediaStorage.delete = async (key) => {
    storageKeys.delete(key);
  };
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw Error("No external requests allowed in text approval fixture");
  };
  const plan: PersonalWorkPlan = {
    kind: "TASK",
    title: "Synthetic reviewed task",
    categoryKey: "WORK",
    workType: null,
    note: null,
    dueAt: "2026-11-13T09:00:00+07:00",
    scheduledEndAt: null,
    tags: [],
    shares: [],
    priority: "MEDIUM",
    checklist: [],
    syncGoogle: false,
  };
  const begin = async (
    userId = owner.id,
    id?: string,
    text = "Synthetic complete review request",
  ) => {
    const chat = await sendAssistant(userId, {
      id,
      requestKey: randomUUID(),
      text,
    });
    const { run } = (await assistantWorker("claim", {})) as {
      run: { id: string; leaseToken: string };
    };
    assert.equal(run.id, chat.id);
    const lookup = async (tool: string, args: Record<string, unknown> = {}) =>
      (
        (await assistantWorker("lookup", {
          ...run,
          lookup: { tool, ...args },
        })) as unknown as { evidence: { result: Record<string, unknown> } }
      ).evidence.result;
    return { chat, run, lookup };
  };
  const creation = async (id?: string) => {
    const { chat, run, lookup } = await begin(owner.id, id);
    await lookup("personalWork.categories");
    await assistantWorker("finish", {
      ...run,
      reply: "Review",
      personalWorkPlan: plan,
    });
    return (await listAssistant(owner.id, chat.id)).conversations[0];
  };
  const binding = (review: Conversation) => {
    assert.ok(review.pendingReview);
    return {
      kind: review.pendingReview.kind,
      revision: review.pendingReview.revision,
      token: review.pendingReview.token,
    };
  };
  const confirm = (
    review: Conversation,
    text = "ok bạn",
    requestKey = randomUUID(),
    userId = owner.id,
  ) =>
    sendAssistant(
      userId,
      { id: review.id, requestKey, text, reviewApproval: binding(review) },
      () => {},
    );
  const mixed = async () => {
    const target = await createPersonalWorkItem(
      {
        title: "Existing text-review task",
        categoryKey: "WORK",
        dueAt: "2026-11-12T13:30:00+07:00",
        scheduledEndAt: "2026-11-12T16:30:00+07:00",
      },
      await assistantActor(prisma, owner.id),
    );
    const { chat, run, lookup } = await begin();
    await lookup("personalWork.categories");
    const detail = (await lookup("personalWork.detail", {
      query: target.id,
    })) as { item: { updatedAt: string } };
    const update = {
      itemId: target.id,
      expectedUpdatedAt: detail.item.updatedAt,
      fields: ["dueAt", "scheduledEndAt"],
      changes: {
        title: null,
        note: null,
        status: null,
        dueAt: "2026-11-13T13:30:00+07:00",
        scheduledEndAt: "2026-11-13T16:30:00+07:00",
      },
    };
    await assistantWorker("finish", {
      ...run,
      reply: "Mixed review",
      personalWorkPlan: plan,
      personalWorkUpdatePlan: update,
    });
    return {
      review: (await listAssistant(owner.id, chat.id)).conversations[0],
      target,
      update,
    };
  };
  try {
    const first = await creation(),
      before = await prisma.taskItem.count(),
      key = randomUUID();
    assert.equal(first.pendingReview?.operations, 1);
    await assert.rejects(
      sendAssistant(owner.id, {
        id: first.id,
        requestKey: randomUUID(),
        text: "ok",
      }),
      /Bản đề xuất/,
    );
    await assert.rejects(
      confirm({
        ...first,
        pendingReview: { ...first.pendingReview!, token: "0".repeat(64) },
      }),
      /Bản đề xuất/,
    );
    await assert.rejects(confirm(first, "ok", randomUUID(), staff.id));
    assert.equal(await prisma.taskItem.count(), before);
    const done = await confirm(first, "duyệt", key);
    assert.equal(await prisma.taskItem.count(), before + 1);
    assert.equal(done.createdPersonalWork?.length, 1);
    assert.equal(done.pendingReview, undefined);
    assert.ok(!JSON.stringify(done).includes("textApprovals"));
    await confirm(first, "duyệt", key);
    assert.equal(await prisma.taskItem.count(), before + 1);
    assert.equal(
      (
        await listAssistant(owner.id, first.id)
      ).conversations[0].messages.filter((m) => m.id === key).length,
      1,
    );
    await assert.rejects(confirm(first, "ok", key), /Mã tin nhắn/);
    const m = await mixed(),
      mixedBefore = await prisma.taskItem.count();
    assert.equal(m.review.pendingReview?.operations, 2);
    await assert.rejects(confirm(m.review, "duyệt 1 mục"), /Số mục/);
    assert.equal(await prisma.taskItem.count(), mixedBefore);
    const mixedDone = await confirm(m.review, "duyệt 2 thay đổi");
    assert.equal(mixedDone.createdPersonalWork?.length, 1);
    assert.equal(mixedDone.updatedPersonalWork?.length, 1);
    assert.equal(await prisma.taskItem.count(), mixedBefore + 1);
    assert.equal(
      (
        await prisma.taskItem.findUniqueOrThrow({ where: { id: m.target.id } })
      ).dueAt!.toISOString(),
      "2026-11-13T06:30:00.000Z",
    );
    const target = await createPersonalWorkItem(
      {
        title: "Update only",
        categoryKey: "WORK",
        dueAt: "2026-11-12T08:00:00+07:00",
      },
      await assistantActor(prisma, owner.id),
    );
    const updateRun = await begin();
    const detail = (await updateRun.lookup("personalWork.detail", {
      query: target.id,
    })) as { item: { updatedAt: string } };
    await assistantWorker("finish", {
      ...updateRun.run,
      reply: "Update review",
      personalWorkUpdatePlan: {
        itemId: target.id,
        expectedUpdatedAt: detail.item.updatedAt,
        fields: ["status"],
        changes: {
          title: null,
          note: null,
          dueAt: null,
          scheduledEndAt: null,
          status: "DONE",
        },
      },
    });
    const updateReview = (await listAssistant(owner.id, updateRun.chat.id))
      .conversations[0];
    assert.equal(updateReview.pendingReview?.kind, "personal-update");
    await confirm(updateReview, "đồng ý");
    assert.equal(
      (await prisma.taskItem.findUniqueOrThrow({ where: { id: target.id } }))
        .status,
      "DONE",
    );
    const race = await creation(),
      raceBefore = await prisma.taskItem.count();
    const raceResults = await Promise.allSettled([
      confirm(race),
      approveAssistantPersonalWork(
        owner.id,
        race.id,
        race.revision!,
        () => {},
        true,
      ),
    ]);
    assert.ok(raceResults.some((r) => r.status === "fulfilled"));
    assert.equal(await prisma.taskItem.count(), raceBefore + 1);
    const old = await creation(),
      newer = await creation(old.id),
      staleBefore = await prisma.taskItem.count();
    await assert.rejects(confirm(old), /Bản đề xuất/);
    assert.equal(await prisma.taskItem.count(), staleBefore);
    await confirm(newer, "xác nhận");
    for (const text of ["không duyệt", '"ok"', "ok nhưng đổi giờ", "duyệt?"]) {
      const review = await creation(),
        count = await prisma.taskItem.count();
      await sendAssistant(owner.id, {
        id: review.id,
        requestKey: randomUUID(),
        text,
        reviewApproval: binding(review),
      });
      assert.equal(await prisma.taskItem.count(), count);
      const { run } = (await assistantWorker("claim", {})) as {
        run: { id: string; leaseToken: string; text: string };
      };
      assert.equal(run.id, review.id);
      assert.ok(!run.text.includes("textApprovals"));
      await assistantWorker("finish", {
        ...run,
        reply: "Synthetic clarification; no action.",
      });
      assert.equal(await prisma.taskItem.count(), count);
    }
    const ambiguous = await creation();
    const row = await prisma.customerAssistantConversation.findUniqueOrThrow({
      where: { id: ambiguous.id },
    });
    const state = row.state as unknown as Record<string, unknown>;
    state.permissionRequest = {
      summary: "Synthetic second review",
      revision: row.revision,
    };
    await prisma.customerAssistantConversation.update({
      where: { id: row.id },
      data: { state: JSON.parse(JSON.stringify(state)) },
    });
    assert.equal(
      (await listAssistant(owner.id, row.id)).conversations[0].pendingReview,
      undefined,
    );
    await assert.rejects(confirm(ambiguous), /Bản đề xuất/);
    const staleData = await mixed(),
      staleCount = await prisma.taskItem.count();
    await prisma.taskItem.update({
      where: { id: staleData.target.id },
      data: { title: "Changed after review" },
    });
    await assert.rejects(confirm(staleData.review));
    assert.equal(await prisma.taskItem.count(), staleCount);
    assert.equal(
      (await listAssistant(owner.id, staleData.review.id)).conversations[0]
        .createdPersonalWork?.length || 0,
      0,
    );
    // Draft order: text uses the canonical DRAFT/HOLD command, never payment/posting.
    const customer = await prisma.customer.create({
      data: { name: `Synthetic text customer ${suffix}` },
    });
    const product = await prisma.product.create({
      data: {
        type: "WATCH",
        sku: `TEXT-${suffix}`,
        title: "Synthetic text watch",
        status: "AVAILABLE",
        watch: {
          create: {
            saleStage: "READY",
            stockStage: "IN_STOCK",
            watchPrice: { create: { salePrice: 2000000 } },
          },
        },
      },
      include: { watch: true },
    });
    const orderRun = await begin();
    for (const [tool, args] of [
      ["customers.search", { query: customer.id }],
      ["watches.search", { query: product.sku }],
      ["watches.detail", { productId: product.id }],
    ] as [string, Record<string, unknown>][])
      await orderRun.lookup(tool, args);
    await assistantWorker("finish", {
      ...orderRun.run,
      reply: "Order review",
      orderPlan: {
        customerId: customer.id,
        customerName: customer.name,
        phone: null,
        hasShipment: false,
        address: null,
        city: null,
        district: null,
        ward: null,
        paymentMethod: "CASH",
        notes: null,
        items: [{ productId: product.id, unitPriceAgreed: 2000000 }],
      },
    });
    const orderReview = (await listAssistant(owner.id, orderRun.chat.id))
      .conversations[0];
    assert.equal(orderReview.pendingReview?.kind, "order");
    const orderKey = randomUUID(),
      orderDone = await confirm(orderReview, "ok", orderKey);
    await confirm(orderReview, "ok", orderKey);
    assert.equal(orderDone.createdOrders?.length, 1);
    assert.equal(
      await prisma.order.count({
        where: { orderItem: { some: { productId: product.id } } },
      }),
      1,
    );
    assert.equal(
      (
        await prisma.watch.findUniqueOrThrow({
          where: { productId: product.id },
        })
      ).saleStage,
      "HOLD",
    );
    assert.equal(
      await prisma.payment.count({
        where: { order_id: orderDone.createdOrders![0].id },
      }),
      0,
    );
    // Media post: isolated storage implementation, no network/file copies can escape.
    const brand = await prisma.brand.create({
      data: { name: `TextBrand-${suffix}`, slug: `text-brand-${suffix}` },
    });
    const galleryKey = `fixtures/text-review/${suffix}.jpg`;
    storageKeys.add(galleryKey);
    const mediaProduct = await prisma.product.create({
      data: {
        type: "WATCH",
        sku: `TEXT-MEDIA-${suffix}`,
        title: "Synthetic gallery watch",
        status: "AVAILABLE",
        brandId: brand.id,
        productImage: {
          create: { fileKey: galleryKey, role: "GALLERY", isForAdmin: true },
        },
        watch: {
          create: {
            saleStage: "READY",
            stockStage: "IN_STOCK",
            watchPrice: { create: { salePrice: 5000000 } },
            watchSpecV2: { create: { caseShape: "ROUND" } },
          },
        },
      },
      include: { watch: true },
    });
    // A literal title match is not proof of form; null/missing specs stay unknown.
    for (const variant of ["square-title-tron", "null-shape", "missing-spec", "too-expensive", "held", "no-gallery"]) {
      await prisma.product.create({data:{
        type:"WATCH",title:"Seiko tròn " + variant,sku:`TEXT-SHAPE-${variant}-${suffix}`,
        status:"AVAILABLE",brandId:brand.id,
        productImage:variant === "no-gallery" ? undefined : {create:{fileKey:galleryKey,role:"GALLERY",isForAdmin:true}},
        watch:{create:{saleStage:variant === "held" ? "HOLD" : "READY",stockStage:"IN_STOCK",
          watchPrice:{create:{salePrice:variant === "too-expensive" ? 9000000 : 5000000}},
          ...(variant === "missing-spec" ? {} : {watchSpecV2:{create:{caseShape:variant === "square-title-tron" ? "SQUARE" : variant === "null-shape" ? null : "ROUND"}}}),
        }},
      }});
    }
    const shapeQuery={brand:brand.name,keywords:["tròn"],count:10,priceMin:4000000,priceMax:6000000};
    const shapeResult=await lookupMediaWatches(prisma,JSON.stringify(shapeQuery));
    assert.equal(shapeResult.total,1);assert.deepEqual(shapeResult.matches.map(w=>w.watchId),[mediaProduct.watch!.id]);
    assert.equal(shapeResult.matches[0].caseShape,"ROUND");assert.deepEqual(shapeResult.selection.keywords,[]);
    const structuredShape=await lookupMediaWatches(prisma,JSON.stringify({...shapeQuery,keywords:[],caseShapes:["ROUND"]}));
    assert.deepEqual(structuredShape.matches,shapeResult.matches);
    const mediaRun = await begin();
    await mediaRun.lookup("media.watches.select", {
      query: JSON.stringify({
        brand: brand.name,
        keywords: [],
        caseShapes: ["ROUND"],
        count: 1,
        similarPrices: false,
        priceMin: 4000000,
        priceMax: 6000000,
      }),
    });
    await mediaRun.lookup("media.posts.draft", {
      query: JSON.stringify({
        sourceMessageId: mediaRun.chat.messages.find((m) => m.role === "user")!
          .id,
        watchIds: [mediaProduct.watch!.id],
        caption: "Synthetic reviewed caption",
        brief: "Synthetic review",
      }),
    });
    await assistantWorker("finish", { ...mediaRun.run, reply: "Media review" });
    const mediaReview = (await listAssistant(owner.id, mediaRun.chat.id))
      .conversations[0];
    assert.equal(mediaReview.pendingReview?.kind, "media-post");
    assert.deepEqual(mediaReview.mediaPostDraft?.selection.caseShapes,["ROUND"]);
    await prisma.watchSpecV2.update({where:{watchId:mediaProduct.watch!.id},data:{caseShape:"SQUARE"}});
    await assert.rejects(recheckMediaPost(prisma,mediaReview.mediaPostDraft!),/thay đổi/);
    await prisma.watchSpecV2.update({where:{watchId:mediaProduct.watch!.id},data:{caseShape:"ROUND"}});
    const mediaKey = randomUUID(),
      mediaDone = await confirm(mediaReview, "duyệt", mediaKey);
    await confirm(mediaReview, "duyệt", mediaKey);
    assert.equal(mediaDone.createdMediaPosts?.length, 1);
    assert.equal(copies, 1);
    // Existing task/technical assignment and permission support use their canonical routes.
    await ensureOperationSpace(prisma, {
      context: "OPERATION",
      provisionWorkTickets: false,
    });
    const workProduct = await prisma.product.create({
      data: {
        type: "WATCH",
        sku: `TEXT-WORK-${suffix}`,
        title: "Synthetic assignment watch",
        watch: { create: { saleStage: "READY", stockStage: "IN_STOCK" } },
      },
    });
    const work = await begin();
    for (const [tool, args] of [
      ["watches.search", { query: workProduct.sku }],
      ["watches.detail", { productId: workProduct.id }],
      ["work.open", { productId: workProduct.id, customerId: null }],
      ["people.search", { query: contact.id }],
    ] as [string, Record<string, unknown>][])
      await work.lookup(tool, args);
    await assistantWorker("finish", {
      ...work.run,
      reply: "Business review",
      plan: {
        customerId: null,
        productId: workProduct.id,
        conditions: [
          {
            key: "inspect",
            requirement: "Synthetic condition",
            expected: "Synthetic expected result",
            kind: "TASK",
            assigneeUserId: contact.id,
            technicalDetailId: null,
          },
        ],
      },
    });
    const businessReview = (await listAssistant(owner.id, work.chat.id))
      .conversations[0];
    assert.equal(businessReview.pendingReview?.kind, "business");
    const assignmentsBefore = await prisma.taskItem.count({
      where: { assignedToUserId: contact.id, title: "Synthetic condition" },
    });
    await prisma.role.update({
      where: { id: role.id },
      data: { permissions: { disconnect: { code: "TASK_MANAGE" } } },
    });
    assert.equal(
      (await listAssistant(owner.id, businessReview.id)).conversations[0]
        .pendingReview,
      undefined,
      "A readable but no-longer-approvable business review must not advertise text approval",
    );
    await assert.rejects(confirm(businessReview));
    assert.equal(
      await prisma.taskItem.count({
        where: { assignedToUserId: contact.id, title: "Synthetic condition" },
      }),
      assignmentsBefore,
    );
    await prisma.role.update({
      where: { id: role.id },
      data: { permissions: { connect: { code: "TASK_MANAGE" } } },
    });
    const businessKey = randomUUID(),
      businessDone = await confirm(businessReview, "ok bạn", businessKey);
    await confirm(businessReview, "ok bạn", businessKey);
    assert.equal(businessDone.customerRequest?.status, "TRACKING");
    assert.equal(
      await prisma.taskItem.count({
        where: { assignedToUserId: contact.id, title: "Synthetic condition" },
      }),
      1,
    );
    const support = await begin(staff.id);
    await assistantWorker("finish", {
      ...support.run,
      reply: "Missing permission",
      missingPermission: "ORDER_CREATE",
      permissionRequest: "Synthetic permission support",
    });
    const supportReview = (await listAssistant(staff.id, support.chat.id))
      .conversations[0];
    assert.equal(supportReview.pendingReview?.kind, "permission-support");
    const supportDone = await confirm(
      supportReview,
      "xác nhận",
      randomUUID(),
      staff.id,
    );
    assert.equal(supportDone.permissionRequests?.length, 1);
    const codeEnvironment = {
      BEN_REPOSITORY_READ_ENABLED: "1",
      BEN_REPOSITORY_COMMIT: "a".repeat(40),
      BEN_GITHUB_READ_TOKEN: "synthetic-not-a-real-github-token",
      BEN_CODE_ENABLED: "1",
      BEN_CODE_WORKER_TOKEN: "synthetic-text-review-code-worker-token",
      BEN_CODE_BASE_REF: "main",
      BEN_CODE_PR_BASE: "main",
    };
    const previousCodeEnv = Object.fromEntries(
      Object.keys(codeEnvironment).map((k) => [k, process.env[k]]),
    );
    try {
      Object.assign(process.env, codeEnvironment);
      const codeChat = await sendAssistant(contact.id, {
        requestKey: randomUUID(),
        text: "Synthetic code review",
      });
      await cancelAssistant(contact.id, codeChat.id);
      const codeRow =
        await prisma.customerAssistantConversation.findUniqueOrThrow({
          where: { id: codeChat.id },
        });
      const codeState = codeRow.state as unknown as Record<string, unknown>;
      codeState.codeDraft = {
        title: "Synthetic code request",
        request: "Review a synthetic source fixture and run tests.",
        revision: codeRow.revision,
        baseSha: codeEnvironment.BEN_REPOSITORY_COMMIT,
        baseRef: "main",
        prBase: "main",
      };
      await prisma.customerAssistantConversation.update({
        where: { id: codeChat.id },
        data: {
          state: JSON.parse(JSON.stringify(codeState)),
          status: "NEEDS_INFO",
        },
      });
      const codeReview = (await listAssistant(contact.id, codeChat.id))
        .conversations[0];
      assert.equal(codeReview.pendingReview?.kind, "code");
      const codeKey = randomUUID(),
        codeDone = await confirm(codeReview, "duyệt", codeKey, contact.id);
      assert.equal(codeDone.codeJob?.status, "QUEUED");
      const codeReplay = await confirm(
        codeReview,
        "duyệt",
        codeKey,
        contact.id,
      );
      assert.equal(codeReplay.codeJob?.id, codeDone.codeJob!.id);
      await assert.rejects(
        confirm(codeReview, "ok", randomUUID(), contact.id),
        /Bản đề xuất/,
      );
      await codeCommand(contact.id, codeChat.id, "cancel", {
        jobId: codeDone.codeJob!.id,
      });
    } finally {
      for (const [key, value] of Object.entries(previousCodeEnv)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
    const revoked = await creation(),
      revokedCount = await prisma.taskItem.count();
    await prisma.role.update({
      where: { id: role.id },
      data: { permissions: { set: [] } },
    });
    await assert.rejects(confirm(revoked));
    assert.equal(await prisma.taskItem.count(), revokedCount);
    assert.equal(
      (await listAssistant(owner.id, revoked.id)).conversations[0]
        .pendingReview,
      undefined,
    );
    console.log(
      "PASS text review integration: bound current commands, single/mixed create, updates, order HOLD, Media copy, business assignment and support; retry/concurrent button+text; missing/stale/ambiguous/count-mismatched/quoted/negated/corrective requests, revoked permissions and changed sources; no private retry data in DTO/worker. External calls/storage are synthetic.",
    );
  } finally {
    globalThis.fetch = oldFetch;
    for (const key of methods)
      (mediaStorage as unknown as Record<string, unknown>)[key] =
        storageOriginals[key];
    if (oldQuota === undefined)
      delete process.env.CUSTOMER_AI_MAX_TURNS_PER_HOUR;
    else process.env.CUSTOMER_AI_MAX_TURNS_PER_HOUR = oldQuota;
    if (oldContact === undefined)
      delete process.env.CUSTOMER_AI_PERMISSION_CONTACT_USER_ID;
    else process.env.CUSTOMER_AI_PERMISSION_CONTACT_USER_ID = oldContact;
    await prisma.user.updateMany({
      where: { id: { in: [owner.id, contact.id, staff.id] } },
      data: { isActive: false },
    });
  }
}
main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
