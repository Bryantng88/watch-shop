export type OrderPaymentFlowTone =
    | "neutral"
    | "warning"
    | "info"
    | "success"
    | "danger";

export function buildOrderPaymentFlow(input: {
    reserveType?: string | null;
    paymentMethod?: string | null;
    depositRequired?: number | string | null;
    depositPaid?: number | string | null;
}) {
    const reserveType = String(input.reserveType ?? "").toUpperCase();
    const paymentMethod = String(input.paymentMethod ?? "").toUpperCase();

    const depositRequired = Number(input.depositRequired ?? 0);
    const depositPaid = Number(input.depositPaid ?? 0);

    const hasDeposit =
        depositRequired > 0 ||
        depositPaid > 0 ||
        ["DEPOSIT", "PARTIAL", "COD"].includes(reserveType);

    const isCod = paymentMethod === "COD" || reserveType === "COD";

    if (hasDeposit && isCod) {
        return {
            label: "Cọc + COD",
            tone: "warning" as const,
            description: "Có cọc trước, phần còn lại thu COD",
        };
    }

    if (hasDeposit) {
        return {
            label: "Có cọc",
            tone: "warning" as const,
            description: "Đơn có khoản cọc / thanh toán trước",
        };
    }

    if (isCod) {
        return {
            label: "COD",
            tone: "info" as const,
            description: "Thu tiền khi giao hàng, chờ đối soát",
        };
    }

    return {
        label: "Không cọc",
        tone: "neutral" as const,
        description: "Thanh toán toàn bộ theo phương thức đã chọn",
    };
}