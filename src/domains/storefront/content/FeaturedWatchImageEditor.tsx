"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
  const [attempt, setAttempt] = useState(0);
  const frame = value || { imageId: "", focalX: 50, focalY: 50, zoom: 1 };
  const current = choices.find(image => image.id === frame.imageId) || cover;
  useEffect(() => {
    const controller = new AbortController();
    setChoices([]); setError("");
    void fetch(`/api/admin/storefront/products?gallery=${encodeURIComponent(productId)}`, {signal:controller.signal,cache:"no-store"})
      .then(response => readUiResponse(response,"Không tải được gallery. Vui lòng thử lại."))
      .then(result => { if (!controller.signal.aborted) { if (!Array.isArray(result.images)) throw Error("Invalid gallery"); setChoices(result.images as Choice[]); } })
      .catch(() => { if (!controller.signal.aborted) setError("Không tải được gallery. Vui lòng thử lại."); });
    return () => controller.abort();
  }, [productId, attempt]);
  return <div className="sfc-featured-image-editor">
    <div className="sfc-featured-image-preview">
      {current && <Image unoptimized src={current.url} alt={current.alt} fill sizes="180px" style={{objectFit:"cover",objectPosition:`${frame.focalX}% ${frame.focalY}%`,transform:`scale(${frame.zoom})`,transformOrigin:`${frame.focalX}% ${frame.focalY}%`}}/>}
    </div>
    <div>
      <label className="sfc-field">Ảnh hiển thị trang chủ<select value={frame.imageId} onChange={event => onChange({...frame,imageId:event.target.value})}>
        <option value="">Dùng ảnh cover</option>
        {choices.map((image,index) => <option key={image.id} value={image.id}>Ảnh gallery {index+1}</option>)}
        {frame.imageId&&!choices.some(image=>image.id===frame.imageId)&&<option value={frame.imageId}>Ảnh đã chọn — đang kiểm tra</option>}
      </select></label>
      {error&&<p role="alert">{error} <AdminButton variant="quiet" density="compact" type="button" onClick={()=>setAttempt(v=>v+1)}>Thử lại</AdminButton></p>}
      <div className="sfc-featured-image-choices" aria-label="Chọn ảnh nổi bật">
        {choices.map((image,index)=><AdminButton key={image.id} variant="contextual" type="button" aria-label={`Chọn ảnh gallery ${index+1}`} aria-pressed={frame.imageId===image.id} onClick={()=>onChange({...frame,imageId:image.id})}><Image unoptimized src={image.url} alt="" width={48} height={60} style={{objectFit:"cover",width:48,height:60}}/></AdminButton>)}
      </div>
      <label className="sfc-field">Ngang · {frame.focalX}%<input type="range" min="0" max="100" value={frame.focalX} onChange={event=>onChange({...frame,focalX:Number(event.target.value)})}/></label>
      <label className="sfc-field">Dọc · {frame.focalY}%<input type="range" min="0" max="100" value={frame.focalY} onChange={event=>onChange({...frame,focalY:Number(event.target.value)})}/></label>
      <label className="sfc-field">Phóng to · {frame.zoom.toFixed(2)}×<input type="range" min="1" max="2" step="0.05" value={frame.zoom} onChange={event=>onChange({...frame,zoom:Number(event.target.value)})}/></label>
      <AdminButton variant="quiet" density="compact" type="button" onClick={()=>onChange(undefined)}>Khôi phục cover & vị trí gốc</AdminButton>
      <small>Chỉ thay đổi khối Đồng hồ nổi bật. Lưu nháp → xem trước → xuất bản.</small>
    </div>
  </div>;
}
