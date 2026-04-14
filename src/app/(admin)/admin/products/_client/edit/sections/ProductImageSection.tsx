"use client";

import MediaPickerInline from "@/components/media/MediaPickerInline";
import MediaPickerMulti, {
    type PickedMediaItem,
} from "@/components/media/MediaPickerMulti";

type Props = {
    storefrontImageKey?: string | null;
    storefrontSaving?: boolean;
    onPickStorefrontImage: (fileKey: string) => void;

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
    tone?: "default" | "primary" | "warning";
}) {
    const cls =
        tone === "primary"
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : tone === "warning"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-slate-50 text-slate-700 border-slate-200";

    return (
        <div className={`rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>
            {label}: {value}
        </div>
    );
}

export default function ProductImageSection({
    storefrontImageKey,
    storefrontSaving = false,
    onPickStorefrontImage,
    chosenImages,
    selectedImages,
    onChosenImagesChange,
    onSelectedImagesChange,
    error,
}: Props) {
    return (
        <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.25V5.75A1.75 1.75 0 0 1 4.75 4h14.5A1.75 1.75 0 0 1 21 5.75v12.5A1.75 1.75 0 0 1 19.25 20H4.75A1.75 1.75 0 0 1 3 18.25Z"
                        />
                        <circle cx="8.25" cy="8.25" r="1.25" />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 15-4.086-4.086a1.5 1.5 0 0 0-2.121 0L9 16.707l-1.793-1.793a1.5 1.5 0 0 0-2.121 0L3 17"
                        />
                    </svg>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="text-lg font-semibold text-slate-900">Ảnh sản phẩm</div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">
                        Quản lý riêng ảnh đại diện bán hàng, kho ảnh đã chọn từ S3, và danh sách
                        ảnh thực sự sẽ lưu vào sản phẩm.
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <InfoChip
                            label="Trong chosen"
                            value={String(chosenImages.length)}
                        />
                        <InfoChip
                            label="Sẽ lưu"
                            value={`${selectedImages.length}/8`}
                            tone="primary"
                        />
                        <InfoChip
                            label="Ảnh đại diện"
                            value={storefrontImageKey ? "Đã chọn" : "Chưa chọn"}
                            tone={storefrontImageKey ? "primary" : "warning"}
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900">
                            Ảnh đại diện bán hàng
                        </div>
                        <div className="mt-1 text-sm leading-6 text-slate-500">
                            Chọn riêng 1 ảnh cho web bán hàng. Ảnh sẽ lấy từ{" "}
                            <span className="font-medium text-slate-700">
                                product/storefront/active
                            </span>{" "}
                            và khi chọn xong sẽ được chuyển sang{" "}
                            <span className="font-medium text-slate-700">
                                product/storefront/chosen
                            </span>.
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <MediaPickerInline
                            value={storefrontImageKey ?? ""}
                            onChange={onPickStorefrontImage}
                            pending={storefrontSaving}
                            profile="storefront-active"
                            className="h-24 w-24 rounded-2xl"
                        />
                    </div>
                </div>

                {storefrontImageKey ? (
                    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                        Đang dùng ảnh storefront: {storefrontImageKey}
                    </div>
                ) : (
                    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                        Chưa chọn ảnh đại diện bán hàng riêng.
                    </div>
                )}
            </div>

            <div className="rounded-3xl border border-blue-200 bg-gradient-to-b from-blue-50/80 to-white p-4">
                <MediaPickerMulti
                    chosenValue={chosenImages}
                    selectedValue={selectedImages}
                    onChosenChange={onChosenImagesChange}
                    onSelectedChange={onSelectedImagesChange}
                    profile="edit"
                    maxFinalSelection={8}
                    title="Ảnh sản phẩm"
                    description="Chọn không giới hạn ảnh từ S3 vào chosen, rồi lọc lại những ảnh thực sự sẽ lưu vào sản phẩm."
                />
            </div>

            {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {error}
                </div>
            ) : null}

            <div className="text-sm text-slate-500">
                Sẽ lưu <span className="font-semibold text-slate-800">{selectedImages.length}/8</span>{" "}
                ảnh · Trong chosen có{" "}
                <span className="font-semibold text-slate-800">{chosenImages.length}</span> ảnh.
            </div>
        </div>
    );
}