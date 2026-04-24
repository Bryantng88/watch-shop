"use client";

import { ImageIcon } from "lucide-react";
import MediaPickerMulti, {
    type PickedMediaItem,
} from "@/components/media/MediaPickerMulti";
import { SectionCard } from "./shared";

type Props = {
    chosenImages: PickedMediaItem[];
    galleryImages: PickedMediaItem[];
    onChosenImagesChange: (items: PickedMediaItem[]) => void;
    onGalleryImagesChange: (items: PickedMediaItem[]) => void;
    error?: string | null;
};

function InfoChip({
    label,
    value,
    tone = "default",
}: {
    label: string;
    value: string;
    tone?: "default" | "primary";
}) {
    const cls =
        tone === "primary"
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : "bg-slate-50 text-slate-700 border-slate-200";

    return (
        <div className={`rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>
            {label}: {value}
        </div>
    );
}

export default function WatchImageSection({
    chosenImages,
    galleryImages,
    onChosenImagesChange,
    onGalleryImagesChange,
    error,
}: Props) {
    return (
        <SectionCard
            icon={<ImageIcon className="h-5 w-5" />}
            title="Hình ảnh"
            subtitle="Chỉ quản lý ảnh gallery của watch. Ảnh đại diện dùng role INLINE riêng."
        >
            <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    <InfoChip
                        label="Trong chosen"
                        value={String(chosenImages.length)}
                    />
                    <InfoChip
                        label="Gallery sẽ lưu"
                        value={`${galleryImages.length}/8`}
                        tone="primary"
                    />
                </div>

                <div className="rounded-3xl border border-blue-200 bg-gradient-to-b from-blue-50/80 to-white p-4">
                    <MediaPickerMulti
                        chosenValue={chosenImages}
                        selectedValue={galleryImages}
                        onChosenChange={onChosenImagesChange}
                        onSelectedChange={onGalleryImagesChange}
                        profile="edit"
                        maxFinalSelection={8}
                        title="Ảnh gallery"
                        description="Chỉ chọn ảnh gallery. Ảnh đại diện INLINE được quản lý riêng cho header/list thumbnail."
                    />
                </div>

                {error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                        {error}
                    </div>
                ) : null}
            </div>
        </SectionCard>
    );
}