export default function WatchImageGrid({ images }: { images: any[] }) {
    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
            {images.map((img) => (
                <div
                    key={img.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                    <img
                        src={img.url || "/placeholder.png"}
                        alt={img.alt || ""}
                        className="aspect-square w-full object-cover"
                    />
                </div>
            ))}

            {images.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                    Chưa có hình
                </div>
            ) : null}
        </div>
    );
}