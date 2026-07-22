import { redirect } from "next/navigation";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PaymentCoordinationPage(props: PageProps) {
  const searchParams = (await props.searchParams) ?? {};
  const params = new URLSearchParams({ view: "payment-collection-flow" });
  const date = first(searchParams.date);
  if (date) params.set("date", date);
  redirect(`/admin/coordination/operation?${params.toString()}`);
}
