// SERVER COMPONENT
import { cookies, headers } from "next/headers";
import NewAcqForm from "../_client/NewAcqForm";

// Tùy bạn lấy từ DB/service thực tế:
async function getVendors() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/vendors?take=100`, {
        headers: { cookie: cookies().toString(), ...Object.fromEntries(headers()) },
        cache: "no-store",
    });
    const json = await res.json();
    return (json.items ?? []).map((v: any) => ({ id: v.id, name: v.name }));
}

async function getProductsLite() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/products?take=200&sort=titleAsc`, {
        headers: { cookie: cookies().toString(), ...Object.fromEntries(headers()) },
        cache: "no-store",
    });
    const json = await res.json();
    return (json.items ?? []).map((p: any) => ({ id: p.id, title: p.title }));
}

export default async function Page() {
    const [vendors, products] = await Promise.all([getVendors(), getProductsLite()]);
    return <NewAcqForm vendors={vendors} products={products} />;
}
