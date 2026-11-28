"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { readUiResponse } from "@/domains/shared/feedback/read-ui-response";
import type { FeaturedImage } from "./contract";

type Choice = { id: string; url: string; alt: string };
export function FeaturedWatchImageEditor({ productId, cover, value, onChange }: {
  productId: string; cover?: { url: string; alt: string }; value?: FeaturedImage;
  onChange: (value: FeaturedImage | undefined) => void;
}) {
  const [choices, setChoices] = useState<Choice[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setChoices([]); setError(""); setLoading(true);
    void fetch(`/api/admin/storefront/products?gallery=${encodeURIComponent(productId)}`, { signal: controller.signal, cache: "no-store" })
      .then(response => readUiResponse(response, "Không tải được gallery. Vui lòng thử lại."))
      .then(result => {
        if (controller.signal.aborted) return;
        if (!Array.isArray(result.images)) throw Error("Invalid gallery");
        setChoices(result.images as Choice[]);
      })
      .catch(() => { if (!controller.signal.aborted) setError("Không tải được gallery. Vui lòng thử lại."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [productId, attempt]);
  const selectedId = value?.imageId || "";
  const options = [...(cover ? [{ id: "", ...cover }] : []), ...choices];
  return <div className="sfc-featured-image-editor">
    <p className="sfc-help">Chọn ảnh dùng riêng cho khối Đồng hồ nổi bật. Không đổi cover của sản phẩm.</p>
    <div className="sfc-featured-image-choices" role="group" aria-label="Chọn ảnh nổi bật">
      {options.map((image, index) => {
        const label = image.id ? `Ảnh gallery ${index + (cover ? 0 : 1)}` : "Ảnh cover";
        const selected = selectedId === image.id;
        return <AdminButton key={image.id || "cover"} variant="contextual" type="button" aria-label={`Chọn ${label.toLowerCase()}`} aria-pressed={selected}
          onClick={() => onChange(image.id ? { imageId: image.id, focalX: 50, focalY: 50, zoom: 1 } : undefined)}>
          <Image unoptimized src={image.url} alt="" width={72} height={90} />
          <span>{label}</span>
          {selected && <Check className="sfc-featured-image-check" size={16} aria-hidden="true" />}
        </AdminButton>;
      })}
    </div>
    {loading && <p role="status" className="sfc-help">Đang tải gallery…</p>}
    {error && <p role="alert">{error} <AdminButton variant="quiet" density="compact" type="button" onClick={() => setAttempt(v => v + 1)}>Thử lại</AdminButton></p>}
    {!loading && !error && !choices.length && <p className="sfc-help">Chưa có ảnh gallery công khai để chọn. Thêm ảnh trong mục Hình ảnh của watch.</p>}
    {!loading && !error && selectedId && !choices.some(image => image.id === selectedId) && <p role="alert">Ảnh đã chọn không còn trong gallery công khai. Hãy chọn lại hoặc dùng cover.</p>}
  </div>;
}