import WatchEditPage from "../edit/page";

export default async function WatchMediaProductionPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return WatchEditPage({ params, searchParams: Promise.resolve({ ...await searchParams, embedded: "1", mode: "media" }) });
}
