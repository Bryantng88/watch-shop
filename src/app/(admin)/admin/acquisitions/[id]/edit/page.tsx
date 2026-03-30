import { ProductType } from "@prisma/client";

import EditAcqForm from "../../_client/EditAcqForm";
import * as service from "../../_server/acquisition.service";
import { getVendorList } from "../../../vendors/_server/vendor.service";

type WatchFlags = {
    hasStrap: boolean;
    needService: boolean;
    hasClasp: boolean;

};

type StrapSpec = {
    material?: string;
    lugWidthMM?: number;
    buckleWidthMM?: number;
    color?: string;
    quickRelease?: boolean;
    sellPrice?: number;
};

function defaultWatchFlags(): WatchFlags {
    return {
        hasStrap: false,
        needService: false,
        hasClasp: false,

    };
}

function parseItemMeta(description?: string | null): {
    watchFlags?: WatchFlags;
    strapSpec?: StrapSpec;
} {
    if (!description) return {};

    try {
        const parsed = JSON.parse(description);
        if (!parsed || typeof parsed !== "object") return {};

        const obj = parsed as Record<string, any>;

        if (obj.watchFlags || obj.strapSpec || obj.kind) {
            return {
                watchFlags: obj.watchFlags
                    ? {
                        hasStrap: Boolean(obj.watchFlags.hasStrap),
                        needService: Boolean(obj.watchFlags.needService),
                        hasClasp: Boolean(obj.watchFlags.hasClasp),
                    }
                    : undefined,
                strapSpec: obj.strapSpec
                    ? {
                        material: obj.strapSpec.material,
                        lugWidthMM:
                            obj.strapSpec.lugWidthMM != null
                                ? Number(obj.strapSpec.lugWidthMM)
                                : undefined,
                        buckleWidthMM:
                            obj.strapSpec.buckleWidthMM != null
                                ? Number(obj.strapSpec.buckleWidthMM)
                                : undefined,
                        color: obj.strapSpec.color,
                        quickRelease:
                            obj.strapSpec.quickRelease == null
                                ? undefined
                                : Boolean(obj.strapSpec.quickRelease),
                        sellPrice:
                            obj.strapSpec.sellPrice != null
                                ? Number(obj.strapSpec.sellPrice)
                                : undefined,
                    }
                    : undefined,
            };
        }

        const looksLikeLegacyStrapSpec =
            "material" in obj ||
            "lugWidthMM" in obj ||
            "buckleWidthMM" in obj ||
            "color" in obj ||
            "quickRelease" in obj ||
            "sellPrice" in obj;

        if (looksLikeLegacyStrapSpec) {
            return {
                strapSpec: {
                    material: obj.material,
                    lugWidthMM: obj.lugWidthMM != null ? Number(obj.lugWidthMM) : undefined,
                    buckleWidthMM: obj.buckleWidthMM != null ? Number(obj.buckleWidthMM) : undefined,
                    color: obj.color,
                    quickRelease: obj.quickRelease == null ? undefined : Boolean(obj.quickRelease),
                    sellPrice: obj.sellPrice != null ? Number(obj.sellPrice) : undefined,
                },
            };
        }
    } catch {
        return {};
    }

    return {};
}

export default async function EditAcquisitionPage({ params }: { params: { id: string } }) {
    const acquisitionData = await service.getAcquisitionDetail(params.id);
    const vendors = await getVendorList();
    const productTypes = Object.values(ProductType);

    const acquisition = {
        id: acquisitionData.id,
        refNo: acquisitionData.refNo ?? "",
        vendorId: acquisitionData.vendorId ?? "",
        acquiredAt: acquisitionData.acquiredAt
            ? acquisitionData.acquiredAt.toISOString().slice(0, 16)
            : "",
        notes: acquisitionData.notes ?? "",
        currency: acquisitionData.currency ?? "VND",
        type: acquisitionData.type ?? "PURCHASE",
        status: acquisitionData.accquisitionStt ?? "DRAFT",
    };

    const items = acquisitionData.acquisitionItem.map((item: any) => {
        const meta = parseItemMeta(item.description);
        const productType = item.productType ?? item.product?.type ?? ProductType.WATCH;

        return {
            id: item.id,
            title: item.productTitle ?? item.product?.title ?? "",
            quantity: Number(item.quantity) || 0,
            unitCost: Number(item.unitCost) || 0,
            productType,
            watchFlags:
                productType === ProductType.WATCH
                    ? meta.watchFlags ?? defaultWatchFlags()
                    : undefined,
            strapSpec:
                productType === ProductType.WATCH_STRAP
                    ? {
                        material: meta.strapSpec?.material ?? "LEATHER",
                        lugWidthMM: Number(meta.strapSpec?.lugWidthMM ?? 20),
                        buckleWidthMM: Number(meta.strapSpec?.buckleWidthMM ?? 18),
                        color: meta.strapSpec?.color ?? "",
                        quickRelease:
                            meta.strapSpec?.quickRelease == null
                                ? true
                                : Boolean(meta.strapSpec?.quickRelease),
                        sellPrice: Number(meta.strapSpec?.sellPrice ?? 0),
                    }
                    : undefined,
        };
    });

    return (
        <div className="mx-auto max-w-6xl space-y-6 pt-2">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Chi tiết / chỉnh sửa phiếu nhập</h1>
                <p className="mt-1 text-sm text-slate-500">
                    {acquisition.status === "DRAFT"
                        ? "Bạn có thể chỉnh toàn bộ dòng sản phẩm và metadata ngay trong trang này."
                        : "Phiếu đã khóa, trang này chỉ còn chế độ xem chi tiết."}
                </p>
            </div>

            <EditAcqForm
                acquisition={acquisition}
                items={items}
                vendors={vendors}
                productTypes={productTypes}
                readOnly={acquisition.status !== "DRAFT"}
            />
        </div>
    );
}
