// acqItems.cache.ts
type ItemRow = { id: string; title: string; quantity: number; unitCost: number };

const CACHE = new Map<string, { at: number; data: ItemRow[] }>();
const INFLIGHT = new Map<string, Promise<ItemRow[]>>();
const TTL = 60_000; // 1 phút

export function isAcqItemsCached(acqId: string) {
    const hit = CACHE.get(acqId);
    if (!hit) return false;
    return Date.now() - hit.at < TTL;
}

export async function getAcqItems(acqId: string): Promise<ItemRow[]> {
    const hit = CACHE.get(acqId);
    if (hit && Date.now() - hit.at < TTL) {
        console.log("✅ Cache hit cho", acqId);
        return hit.data;
    }

    console.log("❌ Cache miss, fetch API", acqId);

    const inflight = INFLIGHT.get(acqId);
    if (inflight) return inflight;

    const p = fetch(`/api/admin/acquisitions/${acqId}/items`, { cache: "no-store" })


        .then(r => r.json())
        .then(j => {
            const data = j.items ?? [];
            CACHE.set(acqId, { at: Date.now(), data });
            INFLIGHT.delete(acqId);
            console.log("✅ Đã lưu cache cho", acqId);

            return data;
        })
        .catch(err => {
            INFLIGHT.delete(acqId);
            throw err;
        });

    INFLIGHT.set(acqId, p);
    return p;
}

export function invalidateAcqItems(acqId: string) {
    CACHE.delete(acqId);
    INFLIGHT.delete(acqId);
}
