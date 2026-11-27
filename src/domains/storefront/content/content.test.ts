import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import type { StorefrontDocument } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { mediaStorage } from "@/domains/media/storage";
import { PERMISSIONS } from "@/constants/permissions";
import {
  getAdminApiPolicy,
  getAdminPagePolicy,
  isAdminAccessAllowed,
} from "@/server/auth/admin-api-policy";
import {
  articleSchema,
  contentImages,
  defaultArticle,
  defaultHome,
  editorialKey,
  homeSchema,
  homePublicationIssues,
  homeImageGuidance,
  safeLink,
} from "./contract";
import { ContentConflict, readHome, resolveImages, saveContent, selectedWatches } from "./service";
import { GET as publicImage } from "@/app/api/public/storefront/media/[id]/[slot]/route";

const restores: Array<() => void> = [];
function patch<T extends object>(object: T, key: keyof T, value: unknown) {
  const original = object[key];
  Reflect.set(object, key, value);
  restores.push(() => {
    Reflect.set(object, key, original);
  });
}
afterEach(() => {
  for (const restore of restores.reverse()) restore();
  restores.length = 0;
  mock.restoreAll();
});
test("content rejects unsafe links, private media paths and duplicate sections", () => {
  for (const path of [
    "javascript:alert(1)",
    "//evil.test",
    "http://evil.test",
    "/\\evil.test",
    "https://user:pass@evil.test",
    "/a\nb",
  ])
    assert.equal(safeLink.safeParse(path).success, false, path);
  for (const path of ["/products?style=DRESS", "/stories/test", "https://www.instagram.com/vintic"])
    assert.equal(safeLink.safeParse(path).success, true, path);
  for (const path of [
    "media/objects/private/original/a.jpg",
    "storefront/hero/../private.jpg",
    "storefront/hero/a.svg",
  ])
    assert.equal(editorialKey.safeParse(path).success, false);
  for (const folder of ["editorial", "about", "collections", "journal", "branding"]) {
    assert.equal(editorialKey.safeParse(`storefront/${folder}/image-123.webp`).success, true);
    assert.equal(editorialKey.safeParse(`storefront/${folder}/../private.webp`).success, false);
  }
  const home = defaultHome();
  home.sections[1] = home.sections[0];
  assert.equal(homeSchema.safeParse(home).success, false);
  const article = defaultArticle();
  article.slug = "Bad Slug";
  assert.equal(articleSchema.safeParse(article).success, false);
});
test("new content routes inherit PRODUCT_UPDATE without widening other admin access", () => {
  for (const method of ["GET", "POST"]) {
    const policy = getAdminApiPolicy("/api/admin/storefront/content", method);
    assert.equal(isAdminAccessAllowed(policy, new Set([PERMISSIONS.PRODUCT_UPDATE])), true);
    assert.equal(isAdminAccessAllowed(policy, new Set([PERMISSIONS.TASK_VIEW])), false);
  }
  assert.equal(
    isAdminAccessAllowed(
      getAdminPagePolicy("/admin/settings/storefront"),
      new Set([PERMISSIONS.PRODUCT_UPDATE]),
    ),
    true,
  );
  assert.equal(getAdminApiPolicy("/api/admin/not-a-route", "GET"), null);
});
test("save, publish, stale revision and unpublish preserve isolated snapshots", async () => {
  let row: StorefrontDocument | null = null;
  const metadata = {
    key: "storefront/editorial/test.webp",
    sizeBytes: 10,
    etag: null,
    contentType: "image/webp",
  };
  patch(prisma, "$transaction", async (callback: unknown) =>
    (callback as (tx: typeof prisma) => Promise<unknown>)(prisma),
  );
  patch(prisma, "$executeRaw", async () => 1);
  patch(prisma.storefrontDocument, "findUnique", async () => row);
  patch(
    prisma.storefrontDocument,
    "create",
    async ({ data }: { data: Record<string, unknown> }) => {
      row = {
        id: "home",
        kind: "HOME",
        draft: data.draft as Prisma.JsonValue,
        published: (data.published ?? null) as Prisma.JsonValue,
        revision: 1,
        publishedAt: null,
        updatedBy: "tester",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return row;
    },
  );
  patch(
    prisma.storefrontDocument,
    "update",
    async ({ data }: { data: Record<string, unknown> }) => {
      if (!row) throw new Error("missing row");
      row = {
        ...row,
        draft: data.draft as Prisma.JsonValue,
        revision: row.revision + 1,
        ...("published" in data
          ? {
              published:
                data.published === Prisma.DbNull ? null : (data.published as Prisma.JsonValue),
              publishedAt: data.publishedAt as Date | null,
            }
          : {}),
      };
      return row;
    },
  );
  patch(mediaStorage, "stat", async () => metadata);
  const home = defaultHome();
  home.hero.image.key = metadata.key;
  home.about.image.key = metadata.key;
  home.collections.forEach(c => {c.image.key = metadata.key;});
  await saveContent({ id: "home", revision: 0, action: "save", content: home }, "tester");
  assert.equal((await readHome()).hero.image.key, "", "draft must not become public");
  await saveContent({ id: "home", revision: 1, action: "publish", content: home }, "tester");
  assert.equal((await readHome()).hero.image.key, metadata.key);
  const changed = structuredClone(home);
  changed.hero.title = "Draft only";
  await saveContent({ id: "home", revision: 2, action: "save", content: changed }, "tester");
  assert.equal((await readHome()).hero.title, home.hero.title);
  assert.equal((await readHome(true)).hero.title, "Draft only");
  await assert.rejects(
    saveContent({ id: "home", revision: 2, action: "publish", content: changed }, "tester"),
    ContentConflict,
  );
  patch(mediaStorage, "stat", async () => null);
  await assert.rejects(
    saveContent({ id: "home", revision: 3, action: "publish", content: changed }, "tester"),
    /ảnh đã mất/,
  );
  assert.equal(
    (await readHome()).hero.title,
    home.hero.title,
    "failed publish must preserve old snapshot",
  );
  await saveContent({ id: "home", revision: 3, action: "unpublish", content: changed }, "tester");
  assert.equal((await readHome()).hero.image.key, "");
  assert.equal((await readHome(true)).hero.title, "Draft only");
  mock.restoreAll();
});
test("public media serves only slots referenced by published content", async () => {
  const content = defaultHome();
  content.hero.image.key = "storefront/editorial/public.webp";
  const draft = structuredClone(content);
  draft.hero.image.key = "storefront/editorial/draft.webp";
  const row = { id: "home", kind: "HOME", draft, published: content, publishedAt: new Date() };
  patch(prisma.storefrontDocument, "findUnique", async () => row);
  const read = mock.fn(async (key: string) => {
    assert.equal(key, "storefront/editorial/public.webp");
    return {
      key,
      bytes: new Uint8Array([1, 2]),
      sizeBytes: 2,
      etag: null,
      contentType: "text/html",
    };
  });
  patch(mediaStorage, "read", read);
  const result = await publicImage(new Request("http://localhost"), {
    params: Promise.resolve({ id: "home", slot: "hero" }),
  });
  assert.equal(result.status, 200);
  assert.equal(result.headers.get("content-type"), "image/webp");
  assert.equal(result.headers.get("cache-control"), "no-store");
  assert.equal(
    (
      await publicImage(new Request("http://localhost"), {
        params: Promise.resolve({ id: "home", slot: "secret" }),
      })
    ).status,
    404,
  );
  row.publishedAt = null as unknown as Date;
  assert.equal(
    (
      await publicImage(new Request("http://localhost"), {
        params: Promise.resolve({ id: "home", slot: "hero" }),
      })
    ).status,
    404,
  );
  assert.equal(read.mock.callCount(), 1);
  const urls = await resolveImages("home", "HOME", content);
  assert.equal(urls.hero.url, "/api/public/storefront/media/home/hero");
  assert.equal(Object.keys(contentImages("HOME", content)).includes("logo"), true);
  mock.restoreAll();
});

test("home publishing supports optional editorial photos and preserves legacy light theme",()=>{
 const home=defaultHome();
 assert.equal(home.hero.theme,"light");
 const legacy=JSON.parse(JSON.stringify(home));delete legacy.hero.theme;
 assert.equal(homeSchema.parse(legacy).hero.theme,"light");
 assert.equal(homePublicationIssues(home).length,1);
 assert.deepEqual(homePublicationIssues(home,true),[]);
 assert.deepEqual(homeImageGuidance(home).map(n=>n.section),["hero","about","collections"]);
 home.hero.image.key="storefront/editorial/test.webp";
 home.sections=home.sections.map(s=>s.id==="about"||s.id==="collections"?{...s,enabled:false}:s);
 assert.deepEqual(homePublicationIssues(home),[]);
 assert.equal(isAdminAccessAllowed(getAdminPagePolicy("/admin/storefront/home"),new Set([PERMISSIONS.PRODUCT_UPDATE])),true);
 assert.equal(isAdminAccessAllowed(getAdminPagePolicy("/admin/storefront/home"),new Set([PERMISSIONS.PRODUCT_VIEW])),false);
});

test("home-only publication cannot publish or overwrite hidden global draft settings",async()=>{
 const draft=defaultHome(),published=defaultHome();
 draft.general.tagline="Unreviewed global draft";published.general.tagline="Current public footer";
 draft.hero.image.key="storefront/editorial/test.webp";draft.about.image.key=draft.hero.image.key;draft.collections.forEach(c=>{c.image.key=draft.hero.image.key;});
 const row={id:"home",kind:"HOME",revision:8,draft,published};let written:Record<string,unknown>|undefined;
 patch(prisma,"$transaction",async(callback:unknown)=>(callback as (tx:typeof prisma)=>Promise<unknown>)(prisma));
 patch(prisma,"$executeRaw",async()=>1);patch(prisma.storefrontDocument,"findUnique",async()=>row);
 patch(prisma.storefrontDocument,"update",async({data}:{data:Record<string,unknown>})=>{written=data;return row;});
 patch(mediaStorage,"stat",async()=>({key:draft.hero.image.key,sizeBytes:10,etag:null,contentType:"image/webp"}));
 const submitted=structuredClone(draft);submitted.hero.title="Reviewed home hero";submitted.general.tagline="Hidden client change";
 await saveContent({id:"home",revision:8,action:"publish",scope:"home",content:submitted},"tester");
 assert.equal((written!.draft as typeof draft).general.tagline,"Unreviewed global draft");
 assert.equal((written!.published as typeof draft).general.tagline,"Current public footer");
 assert.equal((written!.published as typeof draft).hero.title,"Reviewed home hero");
 await assert.rejects(saveContent({id:"home",revision:8,action:"unpublish",scope:"home"},"tester"),/chỉ lưu và xuất bản/);
});


test("home can publish a theme change with automatic hero and optional photos; empty catalogue remains blocked",async()=>{
 const draft=defaultHome();draft.hero.theme="charcoal";
 const row={id:"home",kind:"HOME",revision:4,draft,published:null};let written:Record<string,unknown>|undefined;
 patch(prisma,"$transaction",async(callback:unknown)=>(callback as (tx:typeof prisma)=>Promise<unknown>)(prisma));
 patch(prisma,"$executeRaw",async()=>1);patch(prisma.storefrontDocument,"findUnique",async()=>row);
 patch(prisma.storefrontDocument,"update",async({data}:{data:Record<string,unknown>})=>{written=data;return row;});
 patch(prisma.product,"count",async()=>1);
 await saveContent({id:"home",revision:4,action:"publish",scope:"home",content:draft},"tester");
 assert.equal((written!.published as typeof draft).hero.theme,"charcoal");
 assert.equal((written!.published as typeof draft).about.image.key,"");
 patch(prisma.product,"count",async()=>0);written=undefined;
 await assert.rejects(saveContent({id:"home",revision:4,action:"publish",scope:"home",content:draft},"tester"),/danh mục chưa có ảnh tự động/);
 assert.equal(written,undefined);
});

test("featured image framing is optional for legacy homes and bounded", () => {
  const home=defaultHome();
  assert.equal(homeSchema.safeParse(home).success,true);
  home.featured.images={p1:{imageId:"gallery-1",focalX:30,focalY:70,zoom:1.4}};
  assert.equal(homeSchema.safeParse(home).success,true);
  home.featured.images.p1.zoom=3;
  assert.equal(homeSchema.safeParse(home).success,false);
  home.featured.images.p1.zoom=1;home.featured.images.p1.focalX=-1;
  assert.equal(homeSchema.safeParse(home).success,false);
});
test("publishing rechecks selected gallery ownership and visibility",async()=>{
 const home=defaultHome();home.sections=home.sections.map(s=>({...s,enabled:false}));home.featured.productIds=["p1"];
 home.featured.images={p1:{imageId:"gallery-1",focalX:20,focalY:60,zoom:1.2}};
 patch(prisma,"$transaction",async(callback:unknown)=>(callback as (tx:typeof prisma)=>Promise<unknown>)(prisma));
 patch(prisma,"$executeRaw",async()=>1);
 patch(prisma.storefrontDocument,"findUnique",async()=>({id:"home",kind:"HOME",revision:1,draft:home,published:home}));
 patch(prisma.product,"count",async()=>1);
 let written=false;patch(prisma.storefrontDocument,"update",async()=>{written=true;return {}});
 patch(prisma.productImage,"findFirst",async(args:{where:Record<string,unknown>})=>{
  assert.equal(args.where.id,"gallery-1");assert.equal(args.where.productId,"p1");assert.equal(args.where.isForStorefront,true);assert.deepEqual(args.where.role,{in:["COVER","GALLERY"]});return null;
 });
 await assert.rejects(saveContent({id:"home",revision:1,action:"publish",content:home},"tester"),/không còn công khai/);
 assert.equal(written,false);
 patch(prisma.productImage,"findFirst",async()=>({id:"gallery-1"}));
 await saveContent({id:"home",revision:1,action:"publish",content:home},"tester");assert.equal(written,true);
 home.featured.images={other:{imageId:"gallery-1",focalX:50,focalY:50,zoom:1}};
 await assert.rejects(saveContent({id:"home",revision:1,action:"publish",content:home},"tester"),/phải thuộc đồng hồ đã chọn/);
});


test("homepage image lookup preserves cover and hover and falls back when selection is revoked",async()=>{
 patch(prisma.product,"findMany",async()=>[{id:"p1",slug:"test-watch",title:"Watch",priceVisibility:"HIDE",status:"AVAILABLE",updatedAt:new Date(),brand:null,watch:{saleStage:"READY",stockStage:"IN_STOCK",isCollectible:false},productImage:[{id:"cover",role:"COVER",alt:"Cover",width:100,height:100},{id:"hover",role:"GALLERY",alt:"Gallery",width:100,height:100}]}]);
 patch(prisma.productImage,"findMany",async(args:{where:Record<string,unknown>})=>{
  assert.deepEqual(args.where.productId,{in:["p1"]});assert.equal(args.where.isForStorefront,true);assert.deepEqual(args.where.role,{in:["COVER","GALLERY"]});
  return [{id:"selected",productId:"p1",alt:"Homepage",width:100,height:100}];
 });
 const settings={p1:{imageId:"selected",focalX:30,focalY:60,zoom:1.2}};
 const [card]=await selectedWatches(["p1"],false,settings);
 assert.ok(card.image.url.endsWith("/cover"));assert.ok(card.hoverImage?.url.endsWith("/hover"));assert.ok(card.featuredImage?.url.endsWith("/selected"));
 patch(prisma.productImage,"findMany",async()=>[]);
 const [fallback]=await selectedWatches(["p1"],false,settings);assert.equal(fallback.featuredImage,undefined);assert.ok(fallback.image.url.endsWith("/cover"));
});
