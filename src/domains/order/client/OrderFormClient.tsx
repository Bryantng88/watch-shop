"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Rocket, Save } from "lucide-react";

import GuardNotice from "@/domains/shared/feedback/GuardNotice";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { Button } from "@/domains/shared/ui/form/fields";
import OrderInventoryNotice from "@/domains/order/shared/OrderInventoryNotice";
import OrderPageHeader from "@/domains/order/ui/OrderPageHeader";

import {
  OrderCustomerSection,
  OrderItemsSection,
  OrderNotesSection,
  OrderShipmentSection,
  OrderSummarySidebar,
  buildInitialOrderFormValues,
  buildOrderPayload,
  canEditOrder,
  createProductFormItem,
  getSubtotal,
  validateOrderForm,
} from "../ui/form";

import type {
  CustomerSearchItem,
  OrderFormInitialData,
  OrderFormItem,
  OrderFormValues,
  ProductSearchItem,
  QuickOrderProduct,
  ServiceOption,
} from "../ui/form";

type Props = {
  mode: "create" | "edit";
  orderId?: string;
  initialData?: OrderFormInitialData | null;
  services?: ServiceOption[];
  quickProduct?: QuickOrderProduct | null;
  backHref?: string;
  backLabel?: string;
};

export default function OrderFormClient({
  mode,
  orderId,
  initialData,
  services = [],
  quickProduct = null,
  backHref = "/admin/orders",
  backLabel = "← Danh sách",
}: Props) {
  const isEdit = mode === "edit";
  const quickMode = !isEdit && Boolean(quickProduct?.id);

  const router = useRouter();
  const notify = useNotify();
  const dialog = useAppDialog();
  const progress = useAppProgress();

  const initialValues = useMemo(() => {
    const base = buildInitialOrderFormValues(initialData);

    if (!quickProduct?.id) return base;

    const alreadyAdded = base.items.some(
      (item) => item.productId === quickProduct.id,
    );

    if (alreadyAdded) return base;

    return {
      ...base,
      items: [...base.items, createProductFormItem(quickProduct)],
    };
  }, [initialData, quickProduct]);

  const [values, setValues] = useState<OrderFormValues>(initialValues);

  const [productQuery, setProductQuery] = useState("");
  const [productResults, setProductResults] = useState<ProductSearchItem[]>([]);
  const [searching, setSearching] = useState(false);

  const [customerResults, setCustomerResults] = useState<CustomerSearchItem[]>(
    [],
  );
  const [searchingCustomer, setSearchingCustomer] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const subtotal = useMemo(() => getSubtotal(values.items), [values.items]);
  const canEdit = canEditOrder(initialData?.status);

  const patchValues = useCallback((patch: Partial<OrderFormValues>) => {
    setValues((prev) => ({
      ...prev,
      ...patch,
    }));
  }, []);

  const applyCustomer = useCallback((customer: CustomerSearchItem) => {
    setValues((prev) => ({
      ...prev,
      customerId: customer.id,
      customerName: customer.name ?? "",
      shipPhone: customer.phone ?? prev.shipPhone,
      shipAddress: customer.address ?? "",
      shipCity: customer.city ?? "",
      shipDistrict: customer.district ?? "",
      shipWard: customer.ward ?? "",
    }));

    setCustomerResults([]);
  }, []);
  const handleCustomerPhoneChange = useCallback((phone: string) => {
    setValues((prev) => {
      const shouldClearPickedCustomer = Boolean(prev.customerId);

      return {
        ...prev,
        customerId: null,
        shipPhone: phone,
        ...(shouldClearPickedCustomer
          ? {
            customerName: "",
            shipAddress: "",
            shipCity: "",
            shipDistrict: "",
            shipWard: "",
          }
          : {}),
      };
    });
  }, []);
  function updateItem(index: number, patch: Partial<OrderFormItem>) {
    setValues((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  function removeItem(index: number) {
    setValues((prev) => ({
      ...prev,
      items: prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  const searchProduct = useCallback(async () => {
    const q = productQuery.trim();

    if (q.length < 2) {
      setProductResults([]);
      return;
    }

    setSearching(true);

    try {
      const res = await fetch(
        `/api/admin/orders/catalog/products?q=${encodeURIComponent(q)}`,
      );

      const json = await res.json().catch(() => null);

      setProductResults(Array.isArray(json?.items) ? json.items : []);
    } catch {
      notify.error({
        title: "Không thể tìm sản phẩm",
        message: "Vui lòng thử lại sau.",
      });
    } finally {
      setSearching(false);
    }
  }, [notify, productQuery]);

  useEffect(() => {
    const q = productQuery.trim();

    if (q.length < 2) {
      setProductResults([]);
      return;
    }

    let cancelled = false;

    const timer = window.setTimeout(async () => {
      setSearching(true);

      try {
        const res = await fetch(
          `/api/admin/orders/catalog/products?q=${encodeURIComponent(q)}`,
        );

        const json = await res.json().catch(() => null);

        if (cancelled) return;

        setProductResults(Array.isArray(json?.items) ? json.items : []);
      } catch {
        if (!cancelled) {
          notify.error({
            title: "Không thể tìm sản phẩm",
            message: "Vui lòng thử lại sau.",
          });
        }
      } finally {
        if (!cancelled) {
          setSearching(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [notify, productQuery]);

  useEffect(() => {
    const q = values.shipPhone.trim();

    if (q.length < 3 || values.customerId) {
      setCustomerResults([]);
      setSearchingCustomer(false);
      return;
    }

    let cancelled = false;

    const timer = window.setTimeout(async () => {
      setSearchingCustomer(true);

      try {
        const res = await fetch(
          `/api/admin/orders/catalog/customers?q=${encodeURIComponent(q)}`,
        );

        const json = await res.json().catch(() => null);

        if (cancelled) return;

        setCustomerResults(Array.isArray(json?.items) ? json.items : []);
      } catch {
        if (!cancelled) {
          setCustomerResults([]);
        }
      } finally {
        if (!cancelled) {
          setSearchingCustomer(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [values.customerId, values.shipPhone]);
  function addProduct(product: ProductSearchItem) {
    if (values.items.some((item) => item.productId === product.id)) {
      notify.warning({
        title: "Sản phẩm đã nằm trong đơn",
        message: product.title,
      });
      return;
    }

    patchValues({
      items: [...values.items, createProductFormItem(product)],
    });

    setProductQuery("");
    setProductResults([]);
  }

  function addService(service: ServiceOption) {
    patchValues({
      items: [
        ...values.items,
        {
          kind: "SERVICE",
          productId: null,
          variantId: null,
          title: service.name,
          quantity: 1,
          listPrice: Number(service.defaultPrice || 0),
          unitPriceAgreed: Number(service.defaultPrice || 0),
          serviceCatalogId: service.id,
          serviceScope: "CUSTOMER_ITEM",
        },
      ],
    });
  }

  async function submit(
    submitAs: "DRAFT" | "POSTED" = isEdit ? "DRAFT" : "POSTED",
  ) {
    if (!canEdit) {
      notify.warning({
        title: "Đơn đã khóa",
        message: "Không thể chỉnh sửa trực tiếp đơn ở trạng thái hiện tại.",
      });
      return;
    }

    const validationMessage = validateOrderForm(values);

    if (validationMessage) {
      notify.warning({
        title: "Thiếu thông tin đơn hàng",
        message: validationMessage,
      });
      return;
    }

    const ok = await dialog.confirm({
      title: isEdit
        ? "Lưu thay đổi đơn hàng?"
        : submitAs === "DRAFT"
          ? "Lưu nháp đơn hàng?"
          : "Tạo & post đơn hàng?",
      message:
        submitAs === "DRAFT"
          ? "Đơn sẽ được lưu nháp, chưa tạo payment/shipment và chưa HOLD watch."
          : quickMode
            ? "Đơn sẽ được post ngay. Hệ thống tạo payment/shipment và HOLD watch liên quan."
            : "Đơn sẽ được post ngay. Hệ thống tạo payment/shipment và đưa đơn vào vận hành.",
      confirmText: isEdit
        ? "Lưu thay đổi"
        : submitAs === "DRAFT"
          ? "Lưu nháp"
          : "Tạo & post",
    });

    if (!ok) return;

    setSubmitting(true);

    progress.show({
      title: "Đang lưu đơn hàng",
      message: "Hệ thống đang xử lý qua order domain.",
    });

    try {
      const payload = buildOrderPayload({
        values,
        quickMode,
        quickProductId: quickProduct?.id ?? null,
        status: initialData?.status ?? null,
        submitAs: isEdit ? undefined : submitAs,
      });

      const res = await fetch(
        isEdit ? `/api/admin/orders/${orderId}` : "/api/admin/orders",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.error || "Lưu đơn hàng thất bại.");
      }

      notify.success({
        title: "Đã lưu đơn",
        message: "Order đã được lưu qua domain mới.",
      });

      router.push(`/admin/orders/${isEdit ? orderId : json?.id}`);
      router.refresh();
    } catch (error: any) {
      notify.error({
        title: "Không thể lưu đơn",
        message: error?.message || "Có lỗi xảy ra.",
      });
    } finally {
      progress.hide();
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-5 px-4 pt-6 lg:px-6">
      <OrderPageHeader
        eyebrow={quickMode ? "Watch bridge" : "Order domain"}
        title={
          isEdit
            ? "Chỉnh sửa đơn hàng"
            : quickMode
              ? "Tạo đơn nhanh từ Watch"
              : "Tạo đơn hàng"
        }
        description={
          quickMode
            ? `Quick order từ watch · ${quickProduct?.sku ? `SKU ${quickProduct.sku} · ` : ""
            }Order sẽ đồng bộ HOLD/SOLD cho watch liên quan.`
            : "Form order đã tách UI theo section, nhẹ hơn và đồng bộ với kiến trúc watch."
        }
        backHref={backHref}
        backLabel={backLabel}
        actions={
          <div className="flex items-center gap-2">
            {!isEdit ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => submit("DRAFT")}
                disabled={submitting || !canEdit}
              >
                <Save className="mr-2 h-4 w-4" />
                Lưu nháp
              </Button>
            ) : null}

            <Button
              type="button"
              onClick={() => submit(isEdit ? "DRAFT" : "POSTED")}
              disabled={submitting || !canEdit}
            >
              {isEdit ? (
                <Save className="mr-2 h-4 w-4" />
              ) : (
                <Rocket className="mr-2 h-4 w-4" />
              )}
              {submitting ? "Đang lưu..." : isEdit ? "Lưu đơn" : "Tạo & post"}
            </Button>
          </div>
        }
      />

      {initialData?.status ? (
        <OrderInventoryNotice status={initialData.status} />
      ) : null}

      {!canEdit ? (
        <GuardNotice
          title="Đơn đã khóa chỉnh sửa"
          message="Đơn không còn ở trạng thái nháp. Hãy thao tác qua action của order để giữ đồng bộ payment/shipment/watch."
          tone="locked"
          icon="lock"
        />
      ) : null}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <OrderCustomerSection
            values={values}
            customers={customerResults}
            searchingCustomer={searchingCustomer}
            disabled={!canEdit}
            onChange={(patch) => {
              if ("shipPhone" in patch) {
                handleCustomerPhoneChange(patch.shipPhone ?? "");
                return;
              }

              if ("customerName" in patch && values.customerId) {
                patchValues({
                  customerId: null,
                  customerName: patch.customerName ?? "",
                  shipAddress: "",
                  shipCity: "",
                  shipDistrict: "",
                  shipWard: "",
                });
                return;
              }

              patchValues(patch);
            }} onPickCustomer={applyCustomer}
          />

          <OrderShipmentSection
            values={values}
            disabled={!canEdit}
            onChange={patchValues}
          />

          <OrderItemsSection
            items={values.items}
            services={services}
            productQuery={productQuery}
            productResults={productResults}
            searching={searching}
            disabled={!canEdit}
            quickMode={quickMode}
            onProductQueryChange={setProductQuery}
            onSearchProduct={searchProduct}
            onAddProduct={addProduct}
            onAddService={addService}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
          />

          <OrderNotesSection
            value={values.notes}
            disabled={!canEdit}
            onChange={(notes) => patchValues({ notes })}
          />
        </div>

        <OrderSummarySidebar
          itemsCount={values.items.length}
          subtotal={subtotal}
          isEdit={isEdit}
          canEdit={canEdit}
          submitting={submitting}
          backHref={backHref}
          onSubmit={() => submit(isEdit ? "DRAFT" : "POSTED")}
        />

      </div>
    </div>
  );
}