import BenMediaWorkspace from "@/domains/watch/client/media-workspace/BenMediaWorkspace";
import { getBenMediaWorkspace } from "@/domains/watch/server/media-workspace/ben-media-workspace.query";
import { mediaListSearch } from "@/domains/watch/shared/ben-media-workspace";
export default async function BenMediaPage({searchParams}: {searchParams: Promise<Record<string, string | string[] | undefined>>}) {
  const data = await getBenMediaWorkspace(mediaListSearch(await searchParams));
  return <BenMediaWorkspace data={data} />;
}
