"use client";

import { Package } from "lucide-react";

import InlineNotice from "@/domains/shared/feedback/InlineNotice";
import SectionCard from "../OrderSection";

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
                    ? "Đồng hồ đã được thêm; bạn có thể bổ sung dịch vụ."
                    : "Thêm watch, sản phẩm hoặc dịch vụ vào đơn."
            }
        >
            <div className="space-y-4">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-start">
                <div className="min-w-0 flex-1"><OrderProductSearchPanel
                    query={productQuery}
                    results={productResults}
                    searching={searching}
                    disabled={disabled}
                    onQueryChange={onProductQueryChange}
                    onSearch={onSearchProduct}
                    onAddProduct={onAddProduct}
                /></div>

                {services.some(service => service.isActive !== false) && <select aria-label="Thêm dịch vụ" value="" disabled={disabled}
                    onChange={event => { const service = services.find(item => item.id === event.target.value); if (service) onAddService(service); }}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 lg:w-56">
                    <option value="">+ Thêm dịch vụ</option>
                    {services.filter(service => service.isActive !== false).map(service => <option key={service.id} value={service.id}>{service.name}</option>)}
                </select>}

                </div>
                <div className="divide-y divide-slate-100">
                    {!items.length ? (
                        <InlineNotice
                            tone="warning"
                            title="Chưa có dòng hàng"
                            description="Tìm sản phẩm hoặc chọn dịch vụ để thêm vào đơn."
                        />
                    ) : (
                        items.map((item, index) => (
                            <OrderItemCard
                                key={`${item.kind}-${item.id || item.productId || item.serviceCatalogId || "new"}-${index}`}
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
