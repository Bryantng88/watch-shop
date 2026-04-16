import { notFound } from "next/navigation";
import { prisma } from "@/server/db/client";
import { getOptions } from "../../_components/options";
import ProductSpecOnlyForm from "../_client/SpecOnlyForm";
function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_key, value) => {
            if (value instanceof Date) return value.toISOString();
            if (typeof value === "object" && value?.isDecimal) return Number(value);
            return value;
        })
    );
}

export default async function ProductSpecOnlyPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const [product, opts] = await Promise.all([
        prisma.product.findUnique({
            where: { id },
            include: {
                watchSpec: true,
            },
        }),
        getOptions(),
    ]);

    if (!product) notFound();

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-950">Sửa watch spec</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Trang tối giản cho kỹ thuật chỉnh các thông số spec ảnh hưởng trực tiếp tới đánh giá kỹ thuật.
                </p>
            </div>

            <ProductSpecOnlyForm
                product={serialize(product)}
                movementOptions={serialize(opts.movement)}
                caseMaterialOptions={serialize(opts.caseMaterial)}
                glassOptions={serialize(opts.glass)}
            />
        </div>
    );
}