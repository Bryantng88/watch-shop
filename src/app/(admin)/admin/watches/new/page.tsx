import { redirect } from "next/navigation";
import { createWatchDraft } from "@/domains/watch/server";

export default async function NewWatchPage() {
    const watch = await createWatchDraft({
        title: "Untitled watch",
    });

    redirect(`/admin/watches/${watch.productId}/edit`);
}