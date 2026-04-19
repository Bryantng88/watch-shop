"use client";

import { ImageIcon } from "lucide-react";
import MediaPickerMulti, {
    type PickedMediaItem,
} from "@/components/media/MediaPickerMulti";
import { SectionCard } from "./shared";

type Props = {
    chosenImages: PickedMediaItem[];
    selectedImages: PickedMediaItem[];
    onChosenImagesChange: (items: PickedMediaItem[]) => void;
    onSelectedImagesChange: (items: PickedMediaItem[]) => void;
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
    selectedImages,
    onChosenImagesChange,
    onSelectedImagesChange,
    error,
}: Props) {
    return (
        <SectionCard
            icon={<ImageIcon className="h-5 w-5" />}
            title="Hình ảnh"
            subtitle="Chọn ảnh từ products/edit/active vào chosen trước, rồi lọc ảnh thực sự sẽ lưu cho watch."
        >
            <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    <InfoChip
                        label="Trong chosen"
                        value={String(chosenImages.length)}
                    />
                    <InfoChip
                        label="Sẽ lưu"
                        value={`${selectedImages.length}/8`}
                        tone="primary"
                    />
                </div>

                <div className="rounded-3xl border border-blue-200 bg-gradient-to-b from-blue-50/80 to-white p-4">
                    <MediaPickerMulti
                        chosenValue={chosenImages}
                        selectedValue={selectedImages}
                        onChosenChange={onChosenImagesChange}
                        onSelectedChange={onSelectedImagesChange}
                        profile="edit"
                        maxFinalSelection={8}
                        title="Ảnh watch"
                        description="Có thể chọn nhiều ảnh từ products/edit/active. Khi xác nhận, ảnh sẽ được chuyển sang products/edit/chosen."
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