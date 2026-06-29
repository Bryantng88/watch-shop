import { zaloPost } from "./zalo.client";
import type { ZaloSendTextToGroupInput } from "./types";

export async function sendZaloTextToGroup(input: ZaloSendTextToGroupInput) {
    const groupId = String(input.groupId || "").trim();
    const message = String(input.message || "").trim();

    if (!groupId) throw new Error("Missing Zalo groupId");
    if (!message) throw new Error("Missing Zalo message");

    return zaloPost({
        recipient: {
            group_id: groupId,
        },
        message: {
            text: message,
        },
    });
}