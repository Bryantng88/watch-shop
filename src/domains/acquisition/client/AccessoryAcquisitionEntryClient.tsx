"use client";

import { AcquisitionKindNavigation } from "../ui/new/AcquisitionKindNavigation";
import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { useEffect, useState } from "react";
import { AdminPageHeader, AdminViewTabs } from "@/domains/shared/ui/admin-design-contract";
import { AdminDetailPage } from "@/domains/shared/ui/admin-design-contract/AdminDetail";
import { X } from "lucide-react";
import type { AcquisitionFormVendor } from "./form/acquisition-form.types";
import StrapAcquisitionFormClient from "./StrapAcquisitionFormClient";
import ClaspAcquisitionFormClient from "./ClaspAcquisitionFormClient";
import { listStrapColorsAction } from "@/domains/strap/client/strap.actions";

type Kind = "strap" | "clasp";

export default function AccessoryAcquisitionEntryClient({
  vendors,
  strapColors: initialStrapColors = [],
  initialKind = "strap",
  onClose,
  canCreateWatches = false,
}: {
  vendors: AcquisitionFormVendor[];
  strapColors?: Array<{ id: string; code: string; name: string; colorHex: string | null }>;
  initialKind?: Kind;
  onClose?: () => void;
  canCreateWatches?: boolean;
}) {
  const [kind, setKind] = useState<Kind>(initialKind);
  const [dirty, setDirty] = useState(false);
  const [strapColors, setStrapColors] = useState(initialStrapColors);
  useEffect(() => {
    if (strapColors.length) return;
    void listStrapColorsAction().then(setStrapColors);
  }, [strapColors.length]);
  return (
    <div onChange={()=>setDirty(true)}>
      <AdminDetailPage grouped emphasis>
        <AdminPageHeader showInShell eyebrow="KHO HÀNG / PHIẾU NHẬP" title="Tạo phiếu nhập phụ kiện"
          description="Chọn nhà cung cấp, thêm dây hoặc khóa rồi lưu phiếu. Giá VND nhập theo đơn vị nghìn."
          meta={<div className="flex flex-wrap items-center gap-4">
            {!onClose && <AcquisitionKindNavigation current="accessories" canSwitch={canCreateWatches} dirty={dirty}/>}
            <div className="w-36"><AdminViewTabs label="Loại phụ kiện" density="compact" value={kind} onValueChange={setKind} items={[{value:"strap",label:"Dây"},{value:"clasp",label:"Khóa"}]}/></div>
            {onClose && <AdminButton iconOnly variant="quiet" type="button" onClick={onClose} aria-label="Đóng"><X className="h-4 w-4"/></AdminButton>}
          </div>}/>
      <div className={kind === "strap" ? "" : "hidden"}>
        <StrapAcquisitionFormClient
          vendors={vendors}
          colorOptions={strapColors}
          embedded
          onCreated={onClose}
        />
      </div>
      <div className={kind === "clasp" ? "" : "hidden"}>
        <ClaspAcquisitionFormClient
          vendors={vendors}
          embedded
          onCreated={onClose}
        />
      </div>
      </AdminDetailPage>
    </div>
  );
}
