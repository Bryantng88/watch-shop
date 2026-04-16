import WatchFormClient from "@/domains/watch/client/WatchFormClient";
import { getWatchEditDetail } from "@/domains/watch/server";

export default async function WatchEditPage({
    params,
}: {
    params: { id: string };
}) {
    const detail = await getWatchEditDetail(params.id);

    return <WatchFormClient detail={detail} />;
}