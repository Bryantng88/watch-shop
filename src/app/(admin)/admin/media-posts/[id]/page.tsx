import { notFound } from "next/navigation";
import AdminBreadcrumbs from "@/domains/shared/ui/breadcrumbs/AdminBreadcrumbs";
import MediaPostEditor from "@/domains/media-post/ui/MediaPostEditor";
import { getMediaPostMediaWorkContext, listMediaPostAssets } from "@/domains/media-post/server";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";

export default async function MediaPostPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ embedded?: string }> }) {
  await requirePermission("MEDIA_VIEW");
  const { id } = await params;
  const [post, assets, workContext, postTargets] = await Promise.all([
    prisma.mediaPost.findUnique({
      where: { id },
      include: { targets: { include: { postTarget: true } }, watches: true },
    }),
    listMediaPostAssets(id),
    getMediaPostMediaWorkContext(id),
    prisma.postTarget.findMany({
      where: { isActive: true },
      orderBy: [{ name: "asc" }, { platform: "asc" }],
      select: { id: true, name: true, platform: true },
    }),
  ]);
  if (!post) notFound();
  const { embedded } = await searchParams;
  const content = post.contentJson && typeof post.contentJson === "object" && !Array.isArray(post.contentJson)
    ? post.contentJson as Record<string, unknown>
    : {};
  return (
    <div className={`min-h-full bg-slate-50/70 ${embedded === "1" ? "p-4" : "p-6"}`}>
      <div className="mx-auto max-w-7xl space-y-5">
      {embedded === "1" ? null : <AdminBreadcrumbs items={[{ label: "Media", href: "/admin/coordination/media" }, { label: post.refNo }]} />}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-l-4 border-violet-500 bg-gradient-to-r from-white via-white to-violet-50/70 px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><div className="text-[11px] font-bold uppercase tracking-[0.14em] text-violet-600">{post.refNo}</div><h1 className="mt-1 text-xl font-bold text-slate-950">{post.title}</h1>{post.brief ? <p className="mt-1.5 line-clamp-2 max-w-3xl text-sm text-slate-500">{post.brief}</p> : null}</div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{post.status}</span>
          </div>
        </div>
      </section>
      <MediaPostEditor
        mediaPostId={post.id}
        initialContent={{ title: post.title, hook: String(content.hook ?? ""), brief: post.brief ?? "", caption: post.caption ?? "", body: String(content.body ?? ""), hashtags: String(content.hashtags ?? ""), postTargetIds: post.targets.map((target) => target.postTargetId) }}
        postTargets={postTargets}
        initialAssets={assets.map(({ mediaObject }) => ({
          key: mediaObject.storageKey,
          name: mediaObject.originalFileName,
          url: `/api/media/sign?key=${encodeURIComponent(mediaObject.storageKey)}`,
        }))}
        bindingId={workContext.bindingId}
        publishBindingId={workContext.publishBindingId}
        initialProgress={{
          content: workContext.content || Boolean(post.title.trim() && (String(content.hook ?? "").trim() || post.caption?.trim() || String(content.body ?? "").trim())),
          image: workContext.image || assets.length > 0,
        }}
      />
      </div>
    </div>
  );
}
