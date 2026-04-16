export type WatchKnowledgeItem = {
    summary: string[];
    safeClaims: string[];
    caution: string[];
};

const WATCH_KNOWLEDGE: Record<string, WatchKnowledgeItem> = {
    "longines ultra-chron": {
        summary: [
            "Ultra-Chron là một line có bản sắc riêng trong vintage Longines, thường gắn với tinh thần kỹ thuật và độ chính xác hơn là dress thuần túy.",
            "Ở nhiều mẫu Ultra-Chron, điểm hấp dẫn không chỉ nằm ở wording trên dial mà còn ở cảm giác một chiếc dress có thêm chiều sâu kỹ thuật.",
            "Với các bản dùng case cushion hoặc form mềm thời 60s–70s, Ultra-Chron thường giữ được vẻ vintage rõ nhưng không bị quá nặng nề.",
        ],
        safeClaims: [
            "Có thể nhấn vào identity kỹ thuật của dòng Ultra-Chron.",
            "Có thể nhấn vào sự kết hợp giữa dial sạch, wording rõ và tinh thần precision-driven.",
        ],
        caution: [
            "Không khẳng định tần số beat cụ thể nếu chưa xác định đúng reference hoặc caliber.",
            "Không khẳng định năm sản xuất nếu chưa có reference, serial hoặc caseback.",
            "Không khẳng định đây là bản high-beat cụ thể nếu chưa có xác minh kỹ thuật.",
        ],
    },

    "cushion case": {
        summary: [
            "Case cushion thường tạo cảm giác vintage rõ hơn khi lên tay vì phần thân vỏ có độ mềm và độ đầy khác với case tròn truyền thống.",
            "Với nhiều mẫu vintage, cushion case giúp đồng hồ nhìn có cá tính hơn mà vẫn giữ được độ gọn trên cổ tay.",
        ],
        safeClaims: [
            "Có thể nhấn vào form cushion như một yếu tố tạo cá tính thị giác.",
        ],
        caution: [
            "Không suy diễn reference chỉ từ form vỏ.",
        ],
    },

    "open heart": {
        summary: [
            "Open heart thường thêm chuyển động thị giác cho một chiếc dress watch vốn tĩnh hơn về bố cục.",
            "Điểm hay của open heart nằm ở việc tạo cảm xúc khi nhìn mặt số mà không nhất thiết phải làm tổng thể trở nên phô trương.",
        ],
        safeClaims: [
            "Có thể nhấn vào cảm giác chuyển động và điểm dừng mắt trên dial.",
        ],
        caution: [
            "Không khẳng định mức độ hoàn thiện của bộ máy nếu không nhìn thấy rõ.",
        ],
    },

    "chronometer wording": {
        summary: [
            "Khi chữ Chronometer xuất hiện rõ trên dial, đó thường là một phần identity đáng nhấn hơn là chỉ một dòng text trang trí.",
            "Trong nhiều mẫu vintage, wording như Chronometer hoặc Ultra-Chron tạo nên tính cách riêng cho mặt số nếu được giữ bố cục đủ sạch.",
        ],
        safeClaims: [
            "Có thể nhấn vào giá trị thị giác và identity của wording trên dial.",
        ],
        caution: [
            "Không diễn giải quá sâu về chuẩn chứng nhận nếu chưa xác minh đúng model/reference.",
        ],
    },
};

export function extractKnowledgeKeys(input: {
    brandName?: string | null;
    title?: string | null;
    customBrief?: string | null;
    referenceSample?: string | null;
    watchSpec?: Record<string, any> | null;
}) {
    const source = [
        input.brandName,
        input.title,
        input.customBrief,
        input.referenceSample,
        input.watchSpec?.model,
        input.watchSpec?.ref,
        input.watchSpec?.caseType,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    const keys = new Set<string>();

    if (source.includes("ultra-chron") || source.includes("ultra chron")) {
        keys.add("longines ultra-chron");
    }

    if (source.includes("cushion")) {
        keys.add("cushion case");
    }

    if (source.includes("open heart") || source.includes("open-heart")) {
        keys.add("open heart");
    }

    if (source.includes("chronometer")) {
        keys.add("chronometer wording");
    }

    return Array.from(keys);
}

export function getKnowledgeEnrichment(keys: string[]) {
    const summaries: string[] = [];
    const safeClaims: string[] = [];
    const cautions: string[] = [];

    for (const key of keys) {
        const item = WATCH_KNOWLEDGE[key];
        if (!item) continue;
        summaries.push(...item.summary);
        safeClaims.push(...item.safeClaims);
        cautions.push(...item.caution);
    }

    return {
        summaries: Array.from(new Set(summaries)),
        safeClaims: Array.from(new Set(safeClaims)),
        cautions: Array.from(new Set(cautions)),
    };
}