"use client";

import { Boxes } from "lucide-react";
import { SectionCard, SidebarStat } from "./shared";
import type { WatchFormValues } from "../../client/watch-form.types";

type Props = {
    values: WatchFormValues["media"];
};

export default function WatchMediaSidebar({ values }: Props) {
    const chosenImages = Array.isArray(values.chosenImages) ? values.chosenImages : [];
    const selectedImages = Array.isArray(values.selectedImages) ? values.selectedImages : [];

    return (
        <SectionCard
            icon={<Boxes className="h-5 w-5" />}
            title="Media snapshot"
            subtitle="Hiển thị nhanh, không edit tại đây."
        >
            <div className="grid grid-cols-1 gap-3">
                <SidebarStat label="Trong chosen" value={chosenImages.length} />
                <SidebarStat label="Sẽ lưu" value={`${selectedImages.length}/8`} />
                <SidebarStat label="Has box" value={values.hasBox ? "Có" : "Không"} />
                <SidebarStat label="Has papers" value={values.hasPapers ? "Có" : "Không"} />
                <SidebarStat label="Booklet" value={values.bookletIncluded ? "Có" : "Không"} />
                <SidebarStat label="Card" value={values.cardIncluded ? "Có" : "Không"} />
            </div>
        </SectionCard>
    );
}