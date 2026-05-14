import InlineNotice from "@/domains/shared/feedback/InlineNotice";
import GuardNotice from "@/domains/shared/feedback/GuardNotice";

import {
  getOrderInventoryEffect,
  getOrderStatusLabel,
} from "./order-status";

type Props = {
  status?: string | null;
  productTitle?: string | null;
  compact?: boolean;
};

export default function OrderInventoryNotice({
  status,
  productTitle,
  compact = false,
}: Props) {
  const effect = getOrderInventoryEffect(status);
  const label = getOrderStatusLabel(status);
  const name = productTitle ? `“${productTitle}”` : "watch này";

  if (effect === "SOLD") {
    return (
      <GuardNotice
        tone="danger"
        icon="shield"
        title="Order này đang khóa watch ở trạng thái SOLD"
        message={`${name} sẽ hiển thị SOLD ở Watch vì order hiện là ${label}. Chỉ hủy/hoàn đơn bằng action order, không chỉnh tay ở Watch.`}
      />
    );
  }

  if (effect === "HOLD") {
    return compact ? (
      <InlineNotice
        tone="warning"
        title="Watch đang được giữ bởi order"
        description={`${name} sẽ hiển thị HOLD cho tới khi order được chốt hoặc hủy.`}
      />
    ) : (
      <GuardNotice
        tone="warning"
        icon="warning"
        title="Order này đang giữ watch"
        message={`${name} sẽ hiển thị HOLD ở Watch. Khi post/chốt đơn, hệ thống sẽ chuyển sang SOLD; khi hủy order, hệ thống sẽ tự release về READY nếu không còn order active khác.`}
      />
    );
  }

  return (
    <InlineNotice
      tone="info"
      title="Order không còn tác động tồn kho"
      description="Order đã hủy hoặc không có sản phẩm watch active, nên Watch không bị HOLD/SOLD bởi order này."
    />
  );
}
