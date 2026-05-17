"use client";

import { Package, Plus } from "lucide-react";

import InlineNotice from "@/domains/shared/feedback/InlineNotice";
import { Button } from "@/domains/shared/ui/form/fields";
import { SectionCard } from "@/domains/shared/ui/surface/card";

import OrderItemCard from "./OrderItemCard";
import OrderProductSearchPanel from "./OrderProductSearchPanel";
import type {
    OrderFormItem,
    ProductSearchItem,
    ServiceOption,
} from "./types";

type Props = {
    items: OrderFormItem[];
    services: ServiceOption[];
    productQuery: string;
    productResults: ProductSearchItem[];
    searching?: boolean;
    disabled?: boolean;
    quickMode?: boolean;

    onProductQueryChange: (value: string) => void;
    onSearchProduct: () => void;
    onAddProduct: (product: ProductSearchItem) => void;
    onAddService: (service: ServiceOption) => void;
    onUpdateItem: (index: number, patch: Partial<OrderFormItem>) => void;
    onRemoveItem: (index: number) => void;
};

export default function OrderItemsSection({
    items,
    services,
    productQuery,
    productResults,
    searching,
    disabled,
    quickMode,
    onProductQueryChange,
    onSearchProduct,
    onAddProduct,
    onAddService,
    onUpdateItem,
    onRemoveItem,
}: Props) {
    return (
        <SectionCard
            icon={<Package className="h-5 w-5" />}
            title="Sản phẩm / dịch vụ"
            subtitle={
                quickMode
                    ? "Sản phẩm watch đã được nạp từ bridge, có thể thêm dịch vụ kèm theo."
                    : "Thêm watch, sản phẩm hoặc dịch vụ vào đơn."
            }
        >
            <div className="space-y-4">
                <OrderProductSearchPanel
                    query={productQuery}
                    results={productResults}
                    searching={searching}
                    disabled={disabled}
                    onQueryChange={onProductQueryChange}
                    onSearch={onSearchProduct}
                    onAddProduct={onAddProduct}
                />

                {services.length ? (
                    <div className="flex flex-wrap gap-2">
                        {services
                            .filter((service) => service.isActive !== false)
                            .map((service) => (
                                <Button
                                    key={service.id}
                                    type="button"
                                    variant="outline"
                                    onClick={() => onAddService(service)}
                                    disabled={disabled}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    {service.name}
                                </Button>
                            ))}
                    </div>
                ) : null}

                <div className="space-y-3">
                    {!items.length ? (
                        <InlineNotice
                            tone="warning"
                            title="Chưa có dòng hàng"
                            description="Thêm sản phẩm từ watch bridge hoặc tìm sản phẩm để tạo đơn."
                        />
                    ) : (
                        items.map((item, index) => (
                            <OrderItemCard
                                key={`${item.kind}-${item.productId || item.serviceCatalogId || index}`}
                                item={item}
                                disabled={disabled}
                                onChange={(patch) => onUpdateItem(index, patch)}
                                onRemove={() => onRemoveItem(index)}
                            />
                        ))
                    )}
                </div>
            </div>
        </SectionCard>
    );
}
