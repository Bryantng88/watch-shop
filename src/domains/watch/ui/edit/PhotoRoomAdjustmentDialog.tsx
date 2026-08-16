"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import {
  DEFAULT_PHOTOROOM_ADJUSTMENT,
  type PhotoRoomAdjustment,
  type PhotoRoomOrientationDegrees,
} from "@/domains/watch/shared/photoroom-adjustment";
import { Dialog, DialogFooter, FieldLabel, Select } from "./shared";

type Props = {
  open: boolean;
  pending: boolean;
  initialValue?: PhotoRoomAdjustment | null;
  onClose: () => void;
  onSubmit: (value: PhotoRoomAdjustment) => void;
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
  initialValue,
  onClose,
  onSubmit,
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

  const commands = [
    `Căn ${labels.horizontalAlignment[value.horizontalAlignment].toLowerCase()} theo chiều ngang`,
    `Căn ${labels.verticalAlignment[value.verticalAlignment].toLowerCase()} theo chiều dọc`,
    `Kích thước chủ thể: ${labels.subjectSize[value.subjectSize].toLowerCase()}`,
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
      description="Chọn bố cục trước khi gửi ảnh nguồn sang PhotoRoom. Với ảnh đã xử lý, hệ thống vẫn dùng lại ảnh nguồn nếu còn lưu; mỗi lần tạo preview dùng một API call."
      maxWidthClass="max-w-3xl"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <FieldLabel>Căn ngang</FieldLabel>
            <Select value={value.horizontalAlignment} onChange={(event) => update("horizontalAlignment", event.target.value as PhotoRoomAdjustment["horizontalAlignment"])} options={Object.entries(labels.horizontalAlignment).map(([value, label]) => ({ value, label }))} />
          </label>
          <label>
            <FieldLabel>Căn dọc</FieldLabel>
            <Select value={value.verticalAlignment} onChange={(event) => update("verticalAlignment", event.target.value as PhotoRoomAdjustment["verticalAlignment"])} options={Object.entries(labels.verticalAlignment).map(([value, label]) => ({ value, label }))} />
          </label>
          <label>
            <FieldLabel>Kích thước đồng hồ</FieldLabel>
            <Select value={value.subjectSize} onChange={(event) => update("subjectSize", event.target.value as PhotoRoomAdjustment["subjectSize"])} options={Object.entries(labels.subjectSize).map(([value, label]) => ({ value, label }))} />
          </label>
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

      <DialogFooter>
        <button type="button" onClick={onClose} disabled={pending} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">Hủy</button>
        <button type="button" onClick={() => onSubmit(value)} disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
          <Sparkles className="h-4 w-4" />
          {pending ? "PhotoRoom đang xử lý..." : "Tạo preview mới"}
        </button>
      </DialogFooter>
    </Dialog>
  );
}
