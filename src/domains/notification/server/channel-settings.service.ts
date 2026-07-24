import { Prisma } from "@prisma/client";

import { BUSINESS_EVENTS } from "@/domains/event/registry/business-event-registry";
import { prisma } from "@/server/db/client";
import { getZaloAccessToken, getZaloTokenStatus } from "./channels/zalo/zalo-token.service";

export type NotificationChannelSettingsData = Awaited<
    ReturnType<typeof getNotificationChannelSettingsData>
>;

function clean(value: unknown) {
    return String(value ?? "").trim();
}

function cleanUpper(value: unknown) {
    return clean(value).toUpperCase().replace(/[^A-Z0-9_]+/g, "_");
}

function splitList(value: unknown): string[] {
    return clean(value)
        .split(/[,\n]/g)
        .map((entry) => entry.trim())
        .filter(Boolean);
}

function parseJsonObject(value: unknown): Prisma.InputJsonValue | typeof Prisma.JsonNull {
    const raw = clean(value);
    if (!raw) return Prisma.JsonNull;

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Condition JSON must be an object");
    }

    return parsed as Prisma.InputJsonObject;
}

function booleanFromForm(value: FormDataEntryValue | null) {
    return value === "on" || value === "true" || value === "1";
}

function defaultZaloTemplatesForEvent(eventKey: string) {
    if (eventKey === "task.item.activity.commented") {
        return {
            titleTemplate: "👤 User ({{actorName}}) vừa tạo 1 thảo luận mới:",
            messageTemplate: "💬 Nội dung: {{replyBody}}\n⌚ Đối tượng: đồng hồ {{watchTitle}}\n🧭 Ngữ cảnh: {{contextTitle}}\n⚡ Activity: {{activityTitle}}\n🔗 Mở xử lý: {{route}}",
        };
    }

    if (eventKey === "watch.media.ready_for_publish") {
        return {
            titleTemplate: "👤 {{actorName}} vừa duyệt xong media:",
            messageTemplate: "⌚ Watch: {{watchTitle}}\n🏷️ SKU: {{sku}}\n📣 Kênh đăng: {{publishChannels}}",
        };
    }

    if (eventKey === "watch.saleStage.posted") {
        return {
            titleTemplate: "👤 {{actorName}} vừa hoàn tất đăng bài:",
            messageTemplate: "⌚ Watch: {{watchTitle}}\n🏷️ SKU: {{sku}}\n📣 Kênh đăng: {{publishChannels}}",
        };
    }

    if (eventKey === "technical_issue.created") {
        return {
            titleTemplate: "🔧 TI mới được đưa vào Kiểm tra",
            messageTemplate: "Đồng hồ: {{watchTitle}}\nSKU: {{sku}}\nMã SR: {{serviceRequestRef}}\nNội dung: {{summary}}\nKhu vực: {{area}}\nƯu tiên: {{priority}}\nMở xử lý: {{route}}",
        };
    }

    if (eventKey === "technical_issue.completed") {
        return {
            titleTemplate: "✅ TI đã hoàn tất",
            messageTemplate: "Đồng hồ: {{watchTitle}}\nSKU: {{sku}}\nMã SR: {{serviceRequestRef}}\nNội dung: {{summary}}\nKết quả: {{resolutionNote}}\nChi phí thực tế: {{actualCost}}\nNgười thao tác: {{actorName}}\nXem chi tiết: {{route}}",
        };
    }

    return {
        titleTemplate: "{{eventKey}}",
        messageTemplate: "New event: {{eventKey}}\n{{targetType}}: {{targetId}}",
    };
}

export async function getNotificationChannelSettingsData() {
    const [rules, groups, recentDispatches, tokenStatus] = await Promise.all([
        prisma.notificationRule.findMany({
            where: { channel: "ZALO_OA" },
            orderBy: [{ enabled: "desc" }, { eventKey: "asc" }, { createdAt: "desc" }],
        }),
        prisma.notificationRecipientGroup.findMany({
            orderBy: [{ enabled: "desc" }, { key: "asc" }],
        }),
        prisma.notificationDispatch.findMany({
            where: {
                payloadJson: {
                    path: ["channel"],
                    equals: "ZALO_OA",
                },
            },
            orderBy: { createdAt: "desc" },
            take: 8,
        }),
        getZaloTokenStatus(),
    ]);

    return {
        rules,
        groups,
        recentDispatches,
        tokenStatus,
        events: BUSINESS_EVENTS.map((event) => ({
            key: event.key,
            label: event.label,
            group: event.group,
            targetType: event.targetType,
        })).sort((left, right) => left.key.localeCompare(right.key)),
    };
}

export async function refreshZaloTokenForSettings() {
    try {
        await getZaloAccessToken({ forceRefresh: true });
    } catch {
        // The token service persists the latest refresh error for the settings UI.
    }
}

export async function saveZaloRecipientGroup(formData: FormData) {
    const id = clean(formData.get("id"));
    const key = cleanUpper(formData.get("key"));
    const name = clean(formData.get("name")) || key;
    const zaloGroupId = clean(formData.get("zaloGroupId")) || null;
    const roleNames = splitList(formData.get("roleNames")).map((role) => role.toUpperCase());
    const userIds = splitList(formData.get("userIds"));
    const enabled = booleanFromForm(formData.get("enabled"));

    if (!key) throw new Error("Missing recipient group key");

    const data = {
        key,
        name,
        enabled,
        zaloGroupId,
        roleNames: roleNames.length ? roleNames : Prisma.JsonNull,
        userIds: userIds.length ? userIds : Prisma.JsonNull,
    };

    if (id) {
        await prisma.notificationRecipientGroup.update({
            where: { id },
            data,
        });
        return;
    }

    await prisma.notificationRecipientGroup.upsert({
        where: { key },
        create: data,
        update: data,
    });
}

export async function saveZaloNotificationRule(formData: FormData) {
    const id = clean(formData.get("id"));
    const eventKey = clean(formData.get("eventKey"));
    const recipientGroupKey = cleanUpper(formData.get("recipientGroupKey"));
    const name = clean(formData.get("name")) || `Zalo - ${eventKey}`;
    const titleTemplate = clean(formData.get("titleTemplate")) || null;
    const messageTemplate = clean(formData.get("messageTemplate"));
    const priority = cleanUpper(formData.get("priority")) || "NORMAL";
    const enabled = booleanFromForm(formData.get("enabled"));
    const conditionJson = parseJsonObject(formData.get("conditionJson"));

    if (!eventKey) throw new Error("Missing event key");
    if (!recipientGroupKey) throw new Error("Missing recipient group");
    if (!messageTemplate) throw new Error("Missing message template");

    const data = {
        name,
        eventKey,
        enabled,
        channel: "ZALO_OA",
        recipientGroupKey,
        conditionJson,
        titleTemplate,
        messageTemplate,
        priority,
    };

    if (id) {
        await prisma.notificationRule.update({
            where: { id },
            data,
        });
        return;
    }

    const existingRule = await prisma.notificationRule.findFirst({
        where: {
            channel: "ZALO_OA",
            eventKey,
            recipientGroupKey,
        },
        select: { id: true },
    });

    if (existingRule) {
        await prisma.notificationRule.update({
            where: { id: existingRule.id },
            data,
        });
        return;
    }

    await prisma.notificationRule.create({ data });
}

export async function setZaloNotificationRuleEnabled(formData: FormData) {
    const id = clean(formData.get("id"));
    const enabled = booleanFromForm(formData.get("enabled"));

    if (!id) throw new Error("Missing notification rule id");

    await prisma.notificationRule.update({
        where: { id },
        data: { enabled },
    });
}

export async function setZaloEventEnabled(formData: FormData) {
    const eventKey = clean(formData.get("eventKey"));
    const enabled = booleanFromForm(formData.get("enabled"));
    const recipientGroupKey = cleanUpper(formData.get("recipientGroupKey"));

    if (!eventKey) throw new Error("Missing event key");

    const existing = await prisma.notificationRule.findMany({
        where: {
            channel: "ZALO_OA",
            eventKey,
        },
        select: { id: true },
    });

    if (existing.length) {
        await prisma.notificationRule.updateMany({
            where: {
                channel: "ZALO_OA",
                eventKey,
            },
            data: { enabled },
        });
        return;
    }

    if (!enabled) return;

    const fallbackGroup = recipientGroupKey || (
        await prisma.notificationRecipientGroup.findFirst({
            where: { enabled: true },
            orderBy: { key: "asc" },
            select: { key: true },
        })
    )?.key;

    if (!fallbackGroup) throw new Error("Create a recipient group before enabling this event");

    const templates = defaultZaloTemplatesForEvent(eventKey);

    await prisma.notificationRule.create({
        data: {
            name: `Zalo - ${eventKey}`,
            eventKey,
            enabled: true,
            channel: "ZALO_OA",
            recipientGroupKey: fallbackGroup,
            conditionJson: Prisma.JsonNull,
            titleTemplate: templates.titleTemplate,
            messageTemplate: templates.messageTemplate,
            priority: "NORMAL",
        },
    });
}
