import { prisma } from "@/server/db/client";
import * as prodRepo from "../../_server/product.repo";

function toNumber(value: unknown) {
    if (value == null) return null;
    const anyValue = value as any;

    if (typeof anyValue?.toNumber === "function") {
        return anyValue.toNumber();
    }

    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

export async function getProductServiceHistory(productId: string) {
    return prodRepo.getProductServiceHistory(prisma as any, productId);
}

export async function getAdminProductDetailPageData(productId: string) {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            brand: {
                select: {
                    id: true,
                    name: true,
                },
            },
            vendor: {
                select: {
                    id: true,
                    name: true,
                },
            },
            ProductCategory: {
                select: {
                    id: true,
                    name: true,
                    code: true,
                    scope: true,
                },
            },
            watchSpec: {
                include: {
                    complication: {
                        select: {
                            id: true,
                            name: true,
                            code: true,
                        },
                        orderBy: [{ name: "asc" }],
                    },
                },
            },
            image: {
                where: { role: { in: ["PRIMARY", "GALLERY"] } },
                orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                select: {
                    id: true,
                    fileKey: true,
                    alt: true,
                    role: true,
                    sortOrder: true,
                    createdAt: true,
                },
            },
            variants: {
                orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
                include: {
                    strapSpec: true,
                    partSpec: true,
                    acquisitionItem: {
                        orderBy: [{ createdAt: "desc" }],
                        take: 1,
                        select: {
                            id: true,
                            unitCost: true,
                            currency: true,
                            createdAt: true,
                        },
                    },
                },
            },
            AcquisitionItem: {
                orderBy: [{ createdAt: "desc" }],
                include: {
                    acquisition: {
                        select: {
                            id: true,
                            refNo: true,
                            type: true,
                            acquiredAt: true,
                            accquisitionStt: true,
                            currency: true,
                            vendor: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                            customer: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                    sourceOrderItem: {
                        select: {
                            id: true,
                            title: true,
                            order: {
                                select: {
                                    id: true,
                                    refNo: true,
                                },
                            },
                        },
                    },
                    variant: {
                        select: {
                            id: true,
                            sku: true,
                        },
                    },
                },
            },
            orderItems: {
                orderBy: [{ createdAt: "desc" }],
                include: {
                    order: {
                        select: {
                            id: true,
                            refNo: true,
                            status: true,
                            paymentStatus: true,
                            source: true,
                            customerName: true,
                            createdAt: true,
                            subtotal: true,
                            notes: true,
                        },
                    },
                    ServiceCatalog: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                        },
                    },
                },
            },
            InvoiceItem: {
                orderBy: [{ createdAt: "desc" }],
                include: {
                    invoice: {
                        select: {
                            id: true,
                            code: true,
                            type: true,
                            status: true,
                            issuedAt: true,
                            grandTotal: true,
                            currency: true,
                            orderId: true,
                            serviceRequestId: true,
                            acquisitionId: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    AcquisitionItem: true,
                    orderItems: true,
                    InvoiceItem: true,
                    ServiceRequest: true,
                },
            },
        },
    });

    if (!product) return null;

    const serviceHistory = await getProductServiceHistory(productId);

    const latestVariant = product.variants?.[0] ?? null;
    const latestAcqCost =
        latestVariant?.acquisitionItem?.[0]?.unitCost != null
            ? toNumber(latestVariant.acquisitionItem[0].unitCost)
            : null;

    const acquisitionHistory = (product.AcquisitionItem ?? []).map((row) => ({
        id: row.id,
        quantity: row.quantity ?? 0,
        unitCost: toNumber(row.unitCost),
        currency: row.currency ?? row.acquisition?.currency ?? "VND",
        productTitle: row.productTitle ?? null,
        status: row.status ?? null,
        kind: row.kind ?? null,
        createdAt: row.createdAt,
        variantSku: row.variant?.sku ?? null,
        sourceOrderItem: row.sourceOrderItem
            ? {
                id: row.sourceOrderItem.id,
                title: row.sourceOrderItem.title,
                order: row.sourceOrderItem.order
                    ? {
                        id: row.sourceOrderItem.order.id,
                        refNo: row.sourceOrderItem.order.refNo ?? null,
                    }
                    : null,
            }
            : null,
        acquisition: row.acquisition
            ? {
                id: row.acquisition.id,
                refNo: row.acquisition.refNo ?? null,
                type: row.acquisition.type ?? null,
                acquiredAt: row.acquisition.acquiredAt,
                status: row.acquisition.accquisitionStt ?? null,
                currency: row.acquisition.currency ?? "VND",
                vendorName: row.acquisition.vendor?.name ?? null,
                customerName: row.acquisition.customer?.name ?? null,
            }
            : null,
    }));

    const saleHistory = (product.orderItems ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        kind: row.kind ?? null,
        quantity: row.quantity ?? 0,
        listPrice: toNumber(row.listPrice),
        unitPriceAgreed: toNumber(row.unitPriceAgreed),
        subtotal: toNumber(row.subtotal),
        createdAt: row.createdAt,
        productType: row.productType ?? null,
        serviceScope: row.serviceScope ?? null,
        serviceCatalog: row.ServiceCatalog
            ? {
                id: row.ServiceCatalog.id,
                code: row.ServiceCatalog.code ?? null,
                name: row.ServiceCatalog.name,
            }
            : null,
        order: row.order
            ? {
                id: row.order.id,
                refNo: row.order.refNo ?? null,
                status: row.order.status ?? null,
                paymentStatus: row.order.paymentStatus ?? null,
                source: row.order.source ?? null,
                customerName: row.order.customerName ?? null,
                createdAt: row.order.createdAt,
                subtotal: toNumber(row.order.subtotal),
                notes: row.order.notes ?? null,
            }
            : null,
    }));

    const invoiceHistory = (product.InvoiceItem ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        quantity: toNumber(row.quantity),
        unitPrice: toNumber(row.unitPrice),
        discount: toNumber(row.discount),
        taxRate: toNumber(row.taxRate),
        lineTotal: toNumber(row.lineTotal),
        createdAt: row.createdAt,
        invoice: row.invoice
            ? {
                id: row.invoice.id,
                code: row.invoice.code ?? null,
                type: row.invoice.type ?? null,
                status: row.invoice.status ?? null,
                issuedAt: row.invoice.issuedAt,
                grandTotal: toNumber(row.invoice.grandTotal),
                currency: row.invoice.currency ?? "VND",
                orderId: row.invoice.orderId ?? null,
                serviceRequestId: row.invoice.serviceRequestId ?? null,
                acquisitionId: row.invoice.acquisitionId ?? null,
            }
            : null,
    }));

    return {
        id: product.id,
        title: product.title,
        slug: product.slug ?? null,
        type: product.type,
        tag: product.tag ?? null,
        status: product.status,
        contentStatus: product.contentStatus,
        primaryImageUrl: product.primaryImageUrl ?? null,
        postContent: product.postContent ?? null,
        aiPromptUsed: product.aiPromptUsed ?? null,
        aiGeneratedAt: product.aiGeneratedAt,
        publishedAt: product.publishedAt,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        brand: product.brand
            ? {
                id: product.brand.id,
                name: product.brand.name,
            }
            : null,
        vendor: product.vendor
            ? {
                id: product.vendor.id,
                name: product.vendor.name,
            }
            : null,
        category: product.ProductCategory
            ? {
                id: product.ProductCategory.id,
                name: product.ProductCategory.name,
                code: product.ProductCategory.code,
                scope: product.ProductCategory.scope,
            }
            : null,
        watchSpec: product.watchSpec
            ? {
                ref: product.watchSpec.ref ?? null,
                model: product.watchSpec.model ?? null,
                year: product.watchSpec.year ?? null,
                gender: product.watchSpec.gender ?? null,
                movement: product.watchSpec.movement ?? null,
                caliber: product.watchSpec.caliber ?? null,
                caseType: product.watchSpec.caseType ?? null,
                caseMaterial: product.watchSpec.caseMaterial ?? null,
                goldKarat: product.watchSpec.goldKarat ?? null,
                goldColor: product.watchSpec.goldColor ?? null,
                caseSize: product.watchSpec.caseSize ?? null,
                dialColor: product.watchSpec.dialColor ?? null,
                strap: product.watchSpec.strap ?? null,
                glass: product.watchSpec.glass ?? null,
                length: toNumber(product.watchSpec.length),
                width: toNumber(product.watchSpec.width),
                thickness: toNumber(product.watchSpec.thickness),
                hasStrap: product.watchSpec.hasStrap ?? false,
                isServiced: product.watchSpec.isServiced ?? false,
                hasClasp: product.watchSpec.hasClasp ?? false,
                boxIncluded: product.watchSpec.boxIncluded ?? false,
                bookletIncluded: product.watchSpec.bookletIncluded ?? false,
                cardIncluded: product.watchSpec.cardIncluded ?? false,
                complications: (product.watchSpec.complication ?? []).map((item) => ({
                    id: item.id,
                    name: item.name,
                    code: item.code ?? null,
                })),
            }
            : null,
        images: (product.image ?? []).map((img) => ({
            id: img.id,
            fileKey: img.fileKey,
            alt: img.alt ?? null,
            role: img.role,
            sortOrder: img.sortOrder,
            createdAt: img.createdAt,
        })),
        variants: (product.variants ?? []).map((variant) => ({
            id: variant.id,
            sku: variant.sku ?? null,
            name: variant.name ?? null,
            price: toNumber(variant.price),
            listPrice: toNumber(variant.listPrice),
            salePrice: toNumber(variant.salePrice),
            costPrice: toNumber(variant.costPrice),
            stockQty: variant.stockQty ?? 0,
            availabilityStatus: variant.availabilityStatus ?? null,
            strapSpec: variant.strapSpec
                ? {
                    lugWidthMM: variant.strapSpec.lugWidthMM ?? null,
                    buckleWidthMM: variant.strapSpec.buckleWidthMM ?? null,
                    color: variant.strapSpec.color ?? null,
                    material: variant.strapSpec.material ?? null,
                    quickRelease: variant.strapSpec.quickRelease ?? null,
                }
                : null,
            acquisitionCost: variant.acquisitionItem?.[0]?.unitCost != null
                ? toNumber(variant.acquisitionItem[0].unitCost)
                : null,
            acquisitionCurrency: variant.acquisitionItem?.[0]?.currency ?? "VND",
        })),
        stats: {
            serviceCount: product._count?.ServiceRequest ?? serviceHistory.length,
            acquisitionCount: product._count?.AcquisitionItem ?? 0,
            saleCount: product._count?.orderItems ?? 0,
            invoiceCount: product._count?.InvoiceItem ?? 0,
            latestPrice: toNumber(latestVariant?.price),
            latestListPrice: toNumber(latestVariant?.listPrice),
            latestSalePrice: toNumber(latestVariant?.salePrice),
            latestCostPrice: toNumber(latestVariant?.costPrice) ?? latestAcqCost,
            latestSku: latestVariant?.sku ?? null,
            stockQty: latestVariant?.stockQty ?? 0,
            availabilityStatus: latestVariant?.availabilityStatus ?? null,
        },
        serviceHistory,
        acquisitionHistory,
        saleHistory,
        invoiceHistory,
    };
}