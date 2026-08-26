"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Check, ImageIcon, LoaderCircle, Save } from "lucide-react";
import MediaPickerMulti, { type PickedMediaItem } from "@/components/media/MediaPickerMulti";
import SectionCard from "@/components/_shared/SectionCard";
import {
  removeMediaFromPostAction,
  reorderMediaPostAssetsAction,
  selectMediaForPostAction,
  updateMediaPostContentAction,
} from "@/domains/media-post/actions";
import { applyQueueItemManualTransitionAction } from "@/domains/task/actions/task.actions";
import { notifyParentOfWorkspaceTransition } from "@/domains/shared/ui/transitions/workspace-transition-outcome";
import { PostTargetMultiSelect } from "@/domains/shared/ui/post-target/PostTargetMultiSelect";

type ContentValue = {
  title: string;
  hook: string;
  brief: string;
  caption: string;
  body: string;
  hashtags: string;
  postTargetIds: string[];
};

type PostTargetOption = { id: string; name: string; platform: string | null };

const fieldClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-50";

export default function MediaPostEditor({
  mediaPostId,
  initialAssets,
  initialContent,
  bindingId,
  publishBindingId,
  initialProgress,
  postTargets,
}: {
  mediaPostId: string;
  initialAssets: PickedMediaItem[];
  initialContent: ContentValue;
  bindingId: string | null;
  publishBindingId: string | null;
  initialProgress: { content: boolean; image: boolean };
  postTargets: PostTargetOption[];
}) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentSaved, setContentSaved] = useState(false);
  const [chosen, setChosen] = useState<PickedMediaItem[]>(initialAssets);
  const [selected, setSelected] = useState<PickedMediaItem[]>(initialAssets);
  const [mediaSaving, setMediaSaving] = useState(false);
  const [mediaDirty, setMediaDirty] = useState(false);
  const [mediaSaved, setMediaSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [workProgress, setWorkProgress] = useState(initialProgress);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const savedKeys = useRef(new Set(initialAssets.map((item) => item.key)));

  function change(field: keyof ContentValue, value: string) {
    setContent((current) => ({ ...current, [field]: value }));
    setContentSaved(false);
  }

  async function saveContent() {
    if (!content.title.trim() || contentSaving) return;
    setContentSaving(true);
    setMessage(null);
    try {
      await updateMediaPostContentAction({ mediaPostId, ...content });
      setContentSaved(true);
      setWorkProgress((current) => ({ ...current, content: Boolean(content.title.trim() && (content.hook.trim() || content.caption.trim() || content.body.trim())) }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể lưu nội dung.");
    } finally {
      setContentSaving(false);
    }
  }

  function changeMedia(items: PickedMediaItem[]) {
    setSelected(items);
    setMediaDirty(true);
    setMediaSaved(false);
  }

  async function saveMedia() {
    if (!mediaDirty || mediaSaving) return;
    const nextKeys = new Set(selected.map((item) => item.key));
    const added = selected.filter((item) => !savedKeys.current.has(item.key));
    const removed = [...savedKeys.current].filter((key) => !nextKeys.has(key));
    setMediaSaving(true);
    setMessage(null);
    try {
      for (let index = 0; index < added.length; index += 1) {
        await selectMediaForPostAction({
          mediaPostId,
          storageKey: added[index].key,
          role: "SOCIAL",
          sortOrder: savedKeys.current.size + index,
        });
      }
      for (const storageKey of removed) {
        await removeMediaFromPostAction({ mediaPostId, storageKey });
      }
      await reorderMediaPostAssetsAction({
        mediaPostId,
        storageKeys: selected.map((item) => item.key),
      });
      setWorkProgress((current) => ({ ...current, image: selected.length > 0 }));
      savedKeys.current = nextKeys;
      setMediaDirty(false);
      setMediaSaved(true);
      setMessage("Đã lưu media vào workspace riêng của bài post.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể lưu media.");
    } finally {
      setMediaSaving(false);
    }
  }

  async function completeCurrentStage() {
    const currentBindingId = publishBindingId ?? bindingId;
    const actionKey = publishBindingId ? "mark-posted" : "approve-media";
    if (!currentBindingId || approving || (!publishBindingId && (!workProgress.content || !workProgress.image))) return;
    setApproving(true);
    setMessage(null);
    try {
      const result = await applyQueueItemManualTransitionAction({ bindingId: currentBindingId, actionKey, note: publishBindingId ? "Published from Media Post workspace." : "Approved from Media Post workspace." });
      if (!result.result?.applied || result.result.toState !== "DONE") {
        const reason = result.result && "reason" in result.result ? result.result.reason : "UNKNOWN";
        throw new Error(`Workflow chưa hoàn tất: ${reason}`);
      }
      if (!publishBindingId && (!result.mediaProcessingResult || result.mediaProcessingResult.ok === false || result.mediaProcessingResult.skipped)) {
        throw new Error(`Chưa chuyển sang Đăng bài: ${result.mediaProcessingResult?.reason ?? "MEDIA_PROCESSING_NOT_COMPLETED"}`);
      }
      setApproved(true);
      setMessage(publishBindingId ? "Đã xác nhận đăng Media Post và chuyển sang Done." : "Đã duyệt Media Post và chuyển sang bước Đăng bài.");
      notifyParentOfWorkspaceTransition({ bindingId: currentBindingId, actionKey, fromStageKey: publishBindingId ? "publish" : "media-processing", toStageKey: publishBindingId ? "done" : "publish" });
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể duyệt Media Post.");
    } finally {
      setApproving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-violet-100 bg-white px-5 py-4 shadow-sm">
        <div>
          <div className="text-sm font-semibold text-slate-900">{publishBindingId ? "Đăng Media Post" : "Tiến độ xử lý Media"}</div>
          <div className="mt-1 text-xs text-slate-500">{publishBindingId ? "Sau khi đã đăng lên kênh đích, xác nhận để hoàn tất workflow." : "Lưu từng phần để cập nhật tiến độ; chỉ chuyển stage khi bấm Duyệt xong."}</div>
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
            <span className={workProgress.content ? "text-emerald-700" : "text-slate-400"}>Content {workProgress.content ? "✓" : "○"}</span>
            <span className={workProgress.image ? "text-emerald-700" : "text-slate-400"}>Hình ảnh {workProgress.image ? "✓" : "○"}</span>
            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-violet-700">{[workProgress.content, workProgress.image].filter(Boolean).length}/2</span>
          </div>
        </div>
        <button type="button" onClick={() => void completeCurrentStage()} disabled={!(publishBindingId ?? bindingId) || approving || approved || (!publishBindingId && (!workProgress.content || !workProgress.image))} className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45">
          {approving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : approved ? <Check className="h-4 w-4" /> : null}
          {approving ? "Đang xử lý" : approved ? "Đã hoàn tất" : publishBindingId ? "Xác nhận đã đăng" : "Duyệt xong"}
        </button>
      </div>
      {message ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">{message}</div>
      ) : null}

      <SectionCard
        title="Content"
        subtitle="Soạn nội dung dùng chung trước khi phân phối sang từng kênh."
        right={
          <button
            type="button"
            onClick={() => void saveContent()}
            disabled={contentSaving || !content.title.trim()}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-950 px-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {contentSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : contentSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {contentSaving ? "Đang lưu" : contentSaved ? "Đã lưu" : "Lưu content"}
          </button>
        }
      >
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50/60 p-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-violet-600 shadow-sm ring-1 ring-violet-100"><BookOpen className="h-4 w-4" /></div>
          <div><div className="text-sm font-semibold text-slate-900">Nội dung bài post</div><p className="mt-0.5 text-xs leading-5 text-slate-500">Caption ngắn dùng cho phần mở đầu; body dành cho nội dung đầy đủ.</p></div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="space-y-1.5 lg:col-span-2"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Title</span><input className={fieldClass} value={content.title} onChange={(event) => change("title", event.target.value)} /></label>
          <label className="space-y-1.5 lg:col-span-2"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hook</span><textarea rows={3} className={fieldClass} value={content.hook} onChange={(event) => change("hook", event.target.value)} placeholder="Hook mở đầu và link sản phẩm liên quan" /></label>
          <div className="space-y-2 lg:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kênh đăng bài</span>
            <PostTargetMultiSelect
              value={content.postTargetIds}
              options={postTargets}
              onChange={(postTargetIds) => {
                setContent((current) => ({ ...current, postTargetIds }));
                setContentSaved(false);
              }}
            />
          </div>
          <label className="space-y-1.5"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Brief</span><textarea rows={4} className={fieldClass} value={content.brief} onChange={(event) => change("brief", event.target.value)} placeholder="Mục tiêu và yêu cầu của bài post" /></label>
          <label className="space-y-1.5"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Caption</span><textarea rows={4} className={fieldClass} value={content.caption} onChange={(event) => change("caption", event.target.value)} placeholder="Đoạn mở đầu hiển thị trên social" /></label>
          <label className="space-y-1.5 lg:col-span-2"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Body</span><textarea rows={8} className={fieldClass} value={content.body} onChange={(event) => change("body", event.target.value)} placeholder="Nội dung đầy đủ của bài post" /></label>
          <label className="space-y-1.5 lg:col-span-2"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hashtags</span><textarea rows={2} className={fieldClass} value={content.hashtags} onChange={(event) => change("hashtags", event.target.value)} placeholder="#vintagewatch #vintic" /></label>
        </div>
      </SectionCard>

      <SectionCard
        title="Hình ảnh"
        subtitle="Chọn ảnh từ NAS và quản lý bộ media dành riêng cho bài post."
        right={<div className="flex items-center gap-3"><div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500"><ImageIcon className="h-4 w-4 text-violet-600" />{selected.length} ảnh đã chọn</div><button type="button" onClick={() => void saveMedia()} disabled={mediaSaving || !mediaDirty} className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-950 px-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50">{mediaSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : mediaSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}{mediaSaving ? "Đang lưu" : mediaSaved ? "Đã lưu" : "Lưu hình ảnh"}</button></div>}
        contentClassName="p-5"
      >
        <MediaPickerMulti
          chosenValue={chosen}
          selectedValue={selected}
          onChosenChange={setChosen}
          onSelectedChange={changeMedia}
          profile="media-post"
          audienceSegment="UNISEX"
          maxFinalSelection={20}
          title="Media của bài post"
          description="Ảnh được move theo Media Core vào media/posts/{postId}/objects/."
          selectedTitle="Ảnh sẽ lưu cho bài post"
          selectedDescription="Kéo thả để sắp xếp thứ tự hiển thị của bộ ảnh social."
          browserPresentation="dialog"
        />
      </SectionCard>
    </div>
  );
}
