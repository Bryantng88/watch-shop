export function pickWatchInlineImage(images: any[]) {
    return (
        images
            ?.filter((img) => img.role === "INLINE" && img.isForAdmin)
            ?.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0] || null
    );
}