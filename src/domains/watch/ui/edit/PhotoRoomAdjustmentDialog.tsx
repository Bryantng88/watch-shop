"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import Image from "next/image";

import {
  DEFAULT_PHOTOROOM_ADJUSTMENT,
  type PhotoRoomAdjustment,
  type PhotoRoomOrientationDegrees,
} from "@/domains/watch/shared/photoroom-adjustment";
import { Dialog, DialogFooter, FieldLabel, Select } from "./shared";

type Props = {
  open: boolean;
  pending: boolean;
  localPending?: boolean;
  previewSrc?: string | null;
  canProcessLocally?: boolean;
  localBaseEnhanceMetal?: boolean;
  localBaseShadowMode?: PhotoRoomAdjustment["shadowMode"];
  localDisabledReason?: string | null;
  initialValue?: PhotoRoomAdjustment | null;
  onClose: () => void;
  onSubmit: (value: PhotoRoomAdjustment) => void;
  onSubmitLocal?: (value: PhotoRoomAdjustment) => void;
};

const labels = {
  horizontalAlignment: { left: "Trái", center: "Giữa", right: "Phải" },
  verticalAlignment: { top: "Trên", center: "Giữa", bottom: "Dưới" },
  subjectSize: { small: "Nhỏ hơn", default: "Mặc định", large: "Lớn hơn", xlarge: "Rất lớn" },
  horizontalOffset: { negative: "Sang trái nhẹ", none: "Không dịch", positive: "Sang phải nhẹ" },
  verticalOffset: { negative: "Lên nhẹ", none: "Không dịch", positive: "Xuống nhẹ" },
  shadowMode: { none: "Không shadow", soft: "Mềm", hard: "Cứng", floating: "Nổi" },
  backgroundMode: { white: "Trắng", transparent: "Trong suốt" },
} as const;

export default function PhotoRoomAdjustmentDialog({
  open,
  pending,
  localPending = false,
  previewSrc,
  canProcessLocally = false,
  localBaseEnhanceMetal,
  localBaseShadowMode,
  localDisabledReason,
  initialValue,
  onClose,
  onSubmit,
  onSubmitLocal,
}: Props) {
  const [value, setValue] = useState<PhotoRoomAdjustment>(initialValue ?? DEFAULT_PHOTOROOM_ADJUSTMENT);

  useEffect(() => {
    if (open) setValue(initialValue ?? DEFAULT_PHOTOROOM_ADJUSTMENT);
  }, [initialValue, open]);

  const update = <K extends keyof PhotoRoomAdjustment>(key: K, next: PhotoRoomAdjustment[K]) =>
    setValue((current) => ({ ...current, [key]: next }));

  const totalRotationDegrees = (value.orientationDegrees ?? 0) + value.rotationDegrees;
  const rotationLabel = totalRotationDegrees < 0
    ? `Trái ${Math.abs(totalRotationDegrees)}°`
    : totalRotationDegrees > 0
      ? `Phải ${totalRotationDegrees}°`
      : "Không xoay";
  const zoomPercent = Math.max(40, Math.min(200, value.zoomPercent ?? 100));
  const previewScale = zoomPercent / 100;
  const previewTranslateX = (value.horizontalAlignment === "left" ? -8 : value.horizontalAlignment === "right" ? 8 : 0)
    + (value.horizontalOffset === "negative" ? -5 : value.horizontalOffset === "positive" ? 5 : 0);
  const previewTranslateY = (value.verticalAlignment === "top" ? -8 : value.verticalAlignment === "bottom" ? 8 : 0)
    + (value.verticalOffset === "negative" ? -5 : value.verticalOffset === "positive" ? 5 : 0);
  const previewShadow = value.shadowMode === "none"
    ? "none"
    : value.shadowMode === "hard"
      ? "drop-shadow(7px 9px 5px rgba(30,34,36,.28))"
      : value.shadowMode === "floating"
        ? "drop-shadow(14px 18px 15px rgba(30,34,36,.2))"
        : "drop-shadow(8px 10px 10px rgba(30,34,36,.16))";
  const localAvailable = canProcessLocally
    && value.enhanceMetal === localBaseEnhanceMetal
    && value.shadowMode === localBaseShadowMode;

  const commands = [
    `Căn ${labels.horizontalAlignment[value.horizontalAlignment].toLowerCase()} theo chiều ngang`,
    `Căn ${labels.verticalAlignment[value.verticalAlignment].toLowerCase()} theo chiều dọc`,
    `Thu phóng chủ thể: ${zoomPercent}%`,
    labels.horizontalOffset[value.horizontalOffset],
    labels.verticalOffset[value.verticalOffset],
    `Shadow: ${labels.shadowMode[value.shadowMode].toLowerCase()}`,
    `Nền: ${labels.backgroundMode[value.backgroundMode].toLowerCase()}`,
    value.enhanceMetal ? "Tăng độ bóng kim loại nhẹ" : "Giữ bề mặt kim loại tự nhiên",
    totalRotationDegrees === 0 ? "Không xoay vật thể" : `Xoay vật thể ${rotationLabel.toLowerCase()}`,
    "Giữ khung 2048 × 3840",
  ];

  return (
    <Dialog
      open={open}
      onClose={pending ? () => undefined : onClose}
      title="Điều chỉnh bằng PhotoRoom"
      description="Xem mô phỏng trước khi tạo. Bố cục có thể dựng local không tốn quota sau lần PhotoRoom đầu; thay đổi AI shadow hoặc làm bóng mới cần gọi PhotoRoom."
      maxWidthClass="max-w-5xl"
    >
      <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <FieldLabel>Căn ngang</FieldLabel>
            <Select value={value.horizontalAlignment} onChange={(event) => update("horizontalAlignment", event.target.value as PhotoRoomAdjustment["horizontalAlignment"])} options={Object.entries(labels.horizontalAlignment).map(([value, label]) => ({ value, label }))} />
          </label>
          <label>
            <FieldLabel>Căn dọc</FieldLabel>
            <Select value={value.verticalAlignment} onChange={(event) => update("verticalAlignment", event.target.value as PhotoRoomAdjustment["verticalAlignment"])} options={Object.entries(labels.verticalAlignment).map(([value, label]) => ({ value, label }))} />
          </label>
          <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-3">
            <div className="flex items-center justify-between gap-3">
              <span>
                <FieldLabel>Thu phóng đồng hồ</FieldLabel>
                <span className="block text-[11px] text-slate-500">40%–200% · preview cập nhật ngay, không tốn quota</span>
              </span>
              <span className="min-w-16 rounded-lg bg-violet-50 px-2.5 py-1 text-center text-sm font-bold tabular-nums text-violet-700">
                {zoomPercent}%
              </span>
            </div>
            <div className="mt-3 grid grid-cols-[36px_1fr_36px] items-center gap-2">
              <button
                type="button"
                onClick={() => update("zoomPercent", Math.max(40, zoomPercent - 5))}
                disabled={zoomPercent <= 40}
                className="h-9 rounded-lg border border-slate-200 text-lg font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                aria-label="Thu nhỏ 5%"
              >−</button>
              <input
                type="range"
                min={40}
                max={200}
                step={5}
                value={zoomPercent}
                onChange={(event) => update("zoomPercent", Number(event.target.value))}
                className="w-full accent-violet-600"
                aria-label="Mức thu phóng đồng hồ"
              />
              <button
                type="button"
                onClick={() => update("zoomPercent", Math.min(200, zoomPercent + 5))}
                disabled={zoomPercent >= 200}
                className="h-9 rounded-lg border border-slate-200 text-lg font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                aria-label="Phóng lớn 5%"
              >+</button>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-[10px] font-medium text-slate-400">
              <span>40% · Toàn cảnh</span>
              <button
                type="button"
                onClick={() => update("zoomPercent", 100)}
                className="rounded-md px-2 py-1 font-semibold text-violet-700 hover:bg-violet-50"
              >Vừa khung · 100%</button>
              <span>200% · Cận cảnh</span>
            </div>
            {zoomPercent > 100 ? (
              <p className="mt-2 text-[11px] font-medium text-amber-600">Cận cảnh có thể cắt một phần dây hoặc vỏ; kiểm tra preview bên phải trước khi tạo.</p>
            ) : null}
          </div>
          <label>
            <FieldLabel>Dịch ngang tinh chỉnh</FieldLabel>
            <Select value={value.horizontalOffset} onChange={(event) => update("horizontalOffset", event.target.value as PhotoRoomAdjustment["horizontalOffset"])} options={Object.entries(labels.horizontalOffset).map(([value, label]) => ({ value, label }))} />
          </label>
          <label>
            <FieldLabel>Dịch dọc tinh chỉnh</FieldLabel>
            <Select value={value.verticalOffset} onChange={(event) => update("verticalOffset", event.target.value as PhotoRoomAdjustment["verticalOffset"])} options={Object.entries(labels.verticalOffset).map(([value, label]) => ({ value, label }))} />
          </label>
          <label>
            <FieldLabel>Shadow</FieldLabel>
            <Select value={value.shadowMode} onChange={(event) => update("shadowMode", event.target.value as PhotoRoomAdjustment["shadowMode"])} options={Object.entries(labels.shadowMode).map(([value, label]) => ({ value, label }))} />
          </label>
          <label>
            <FieldLabel>Nền</FieldLabel>
            <Select value={value.backgroundMode} onChange={(event) => update("backgroundMode", event.target.value as PhotoRoomAdjustment["backgroundMode"])} options={Object.entries(labels.backgroundMode).map(([value, label]) => ({ value, label }))} />
          </label>
          <button
            type="button"
            role="switch"
            aria-checked={value.enhanceMetal}
            onClick={() => update("enhanceMetal", !value.enhanceMetal)}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left"
          >
            <span>
              <span className="block text-xs font-semibold text-slate-800">Tăng bóng kim loại</span>
              <span className="mt-0.5 block text-[11px] text-slate-500">Tăng highlight, nâng nhẹ vùng phản chiếu tối</span>
            </span>
            <span className={`relative h-5 w-9 shrink-0 rounded-full transition ${value.enhanceMetal ? "bg-violet-600" : "bg-slate-300"}`}>
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${value.enhanceMetal ? "left-[18px]" : "left-0.5"}`} />
            </span>
          </button>
          <label className="sm:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
            <span className="flex items-center justify-between gap-3">
              <span>
                <FieldLabel>Xoay vật thể</FieldLabel>
                <span className="block text-[11px] text-slate-500">Chọn hướng ảnh trước, sau đó tinh chỉnh nhẹ nếu cần</span>
              </span>
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {rotationLabel}
              </span>
            </span>
            <span className="mt-3 grid grid-cols-4 gap-1.5">
              {([
                [-90, "Trái 90°"],
                [0, "Giữ nguyên"],
                [90, "Phải 90°"],
                [180, "Lật 180°"],
              ] as const).map(([degrees, label]) => (
                <button
                  key={degrees}
                  type="button"
                  onClick={() => update("orientationDegrees", degrees as PhotoRoomOrientationDegrees)}
                  className={`rounded-lg border px-2 py-2 text-[11px] font-semibold transition ${value.orientationDegrees === degrees ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  {label}
                </button>
              ))}
            </span>
            <span className="mt-3 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Tinh chỉnh</span>
            <input
              type="range"
              min={-15}
              max={15}
              step={1}
              value={value.rotationDegrees ?? 0}
              onChange={(event) => update("rotationDegrees", Number(event.target.value))}
              className="mt-3 w-full accent-violet-600"
              aria-label="Tinh chỉnh góc xoay; âm là trái, dương là phải"
            />
            <span className="mt-1 flex justify-between text-[10px] font-medium text-slate-400">
              <span>Trái 15°</span>
              <span>0°</span>
              <span>Phải 15°</span>
            </span>
          </label>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-100 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-900">Mô phỏng storefront</span>
              <span className="text-[10px] font-medium text-slate-500">Không tốn quota</span>
            </div>
            <div
              className={`relative mx-auto aspect-[8/15] w-full max-w-[230px] overflow-hidden rounded-xl border border-slate-200 ${value.backgroundMode === "transparent" ? "bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%),linear-gradient(-45deg,#e5e7eb_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e5e7eb_75%),linear-gradient(-45deg,transparent_75%,#e5e7eb_75%)] bg-[length:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0px]" : "bg-white"}`}
            >
              {previewSrc ? (
                <Image
                  src={previewSrc}
                  alt="Mô phỏng bố cục Cover"
                  fill
                  unoptimized
                  className="object-contain transition-transform duration-200"
                  style={{
                    transform: `translate(${previewTranslateX}%, ${previewTranslateY}%) rotate(${totalRotationDegrees}deg) scale(${previewScale})`,
                    filter: `${previewShadow}${value.enhanceMetal ? " brightness(1.04) contrast(1.04)" : ""}`,
                  }}
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center px-4 text-center text-xs text-slate-400">Chọn Cover để xem mô phỏng</span>
              )}
            </div>
            <p className="mt-2 text-[11px] leading-4 text-slate-500">Mô phỏng chính xác bố cục; AI shadow và độ bóng có thể chênh nhẹ so với PhotoRoom.</p>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50/60 p-4">
          <div className="text-sm font-semibold text-violet-950">Lệnh sẽ gửi</div>
          <ol className="mt-3 space-y-2 text-sm text-violet-900">
            {commands.map((command, index) => (
              <li key={command} className="flex gap-2">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-[11px] font-bold text-violet-700">{index + 1}</span>
                <span>{command}</span>
              </li>
            ))}
          </ol>
          </div>
        </div>
      </div>

      <DialogFooter>
        <button type="button" onClick={onClose} disabled={pending} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">Hủy</button>
        {onSubmitLocal ? (
          <button
            type="button"
            onClick={() => onSubmitLocal(value)}
            disabled={pending || localPending || !localAvailable}
            title={!canProcessLocally
              ? localDisabledReason ?? "Cần tạo ít nhất một preview PhotoRoom trong phiên này"
              : !localAvailable
                ? "Thay đổi AI shadow hoặc làm bóng kim loại cần dùng PhotoRoom"
                : "Dựng lại bố cục bằng Sharp, không gọi PhotoRoom"}
            className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {localPending ? "Đang xử lý local..." : "Dựng bố cục local · không quota"}
          </button>
        ) : null}
        <button type="button" onClick={() => onSubmit(value)} disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
          <Sparkles className="h-4 w-4" />
          {pending ? "PhotoRoom đang xử lý..." : "Tạo bằng AI PhotoRoom"}
        </button>
      </DialogFooter>
    </Dialog>
  );
}
