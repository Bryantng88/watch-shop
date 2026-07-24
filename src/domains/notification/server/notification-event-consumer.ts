
import type { Prisma } from "@prisma/client";
import { createNotification } from "../notification.repo";
import { findUsersByRoleNames } from "@/app/(admin)/admin/users/_server/user.repo";
import { sendZaloTextToGroup } from "./channels/zalo";

type NotificationEventLog = {
    id: string;
    eventKey: string;
    targetType: string;
    targetId: string;
    actorUserId?: string | null;
    metadataJson?: Prisma.JsonValue | null;
};

type NotificationRuleRow = {
    id: string;
    name: string;
    eventKey: string;
    enabled: boolean;
    channel: string;
    recipientGroupKey: string;
    conditionJson?: Prisma.JsonValue | null;
    titleTemplate?: string | null;
    messageTemplate: string;
    priority: string;
};

type NotificationRecipientGroupRow = {
    key: string;
    enabled: boolean;
    roleNames?: Prisma.JsonValue | null;
    userIds?: Prisma.JsonValue | null;
    zaloGroupId?: string | null;
};

function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
}

function clean(value: unknown) {
    return String(value ?? "").trim();
}

function normalizeEventLog(value: unknown): NotificationEventLog {
    const row = asRecord(value);

    return {
        id: clean(row.id),
        eventKey: clean(row.eventKey),
        targetType: clean(row.targetType),
        targetId: clean(row.targetId),
        actorUserId: clean(row.actorUserId) || null,
        metadataJson: (row.metadataJson ?? null) as Prisma.JsonValue | null,
    };
}

async function enrichNotificationEvent(
    client: Prisma.TransactionClient,
    event: NotificationEventLog,
) {
    const metadata = asRecord(event.metadataJson);
    const enriched: Record<string, unknown> = { ...metadata };

    if (!clean(enriched.actorName) && event.actorUserId) {
        const actor = await client.user.findUnique({
            where: { id: event.actorUserId },
            select: { name: true, email: true },
        });
        enriched.actorName = clean(actor?.name) || clean(actor?.email) || "System";
    }

    if (
        event.targetType === "WATCH" &&
        ["watch.media.ready_for_publish", "watch.saleStage.posted"].includes(event.eventKey)
    ) {
        const watch = await client.watch.findUnique({
            where: { id: event.targetId },
            select: {
                product: {
                    select: {
                        postTargets: {
                            select: { postTarget: { select: { name: true, platform: true } } },
                        },
                    },
                },
            },
        });
        enriched.publishChannels = watch?.product?.postTargets
            .map(({ postTarget }) => clean(postTarget.name) || clean(postTarget.platform))
            .filter(Boolean)
            .join(", ") || "Chưa chọn";
    }

    if (
        event.targetType === "TECHNICAL_ISSUE" &&
        ["technical_issue.created", "technical_issue.completed"].includes(event.eventKey)
    ) {
        const issue = await client.technicalIssue.findUnique({
            where: { id: event.targetId },
            select: {
                summary: true,
                note: true,
                area: true,
                priority: true,
                actualCost: true,
                resolutionNote: true,
                serviceRequest: {
                    select: {
                        id: true,
                        refNo: true,
                        skuSnapshot: true,
                        brandSnapshot: true,
                        modelSnapshot: true,
                    },
                },
            },
        });

        const serviceRequest = issue?.serviceRequest;
        const watchTitle = [
            clean(serviceRequest?.brandSnapshot),
            clean(serviceRequest?.modelSnapshot),
        ].filter(Boolean).join(" ");

        enriched.watchTitle =
            clean(enriched.watchTitle) ||
            watchTitle ||
            clean(serviceRequest?.skuSnapshot) ||
            "Chưa có thông tin đồng hồ";
        enriched.sku =
            clean(enriched.sku) ||
            clean(serviceRequest?.skuSnapshot) ||
            "N/A";
        enriched.serviceRequestRef =
            clean(enriched.serviceRequestRef) ||
            clean(serviceRequest?.refNo) ||
            clean(serviceRequest?.id);
        enriched.summary =
            clean(enriched.summary) ||
            clean(issue?.summary) ||
            clean(issue?.note) ||
            "Yêu cầu kiểm tra kỹ thuật";
        enriched.area = clean(enriched.area) || clean(issue?.area) || "GENERAL";
        enriched.priority =
            clean(enriched.priority) ||
            clean(issue?.priority) ||
            "NORMAL";
        enriched.actorName = clean(enriched.actorName) || "Hệ thống";
        enriched.actualCost =
            enriched.actualCost ??
            (issue?.actualCost === null || issue?.actualCost === undefined
                ? 0
                : Number(issue.actualCost));
        enriched.resolutionNote =
            clean(enriched.resolutionNote) ||
            clean(issue?.resolutionNote) ||
            "Đã hoàn tất xử lý";
        enriched.route =
            clean(enriched.route) ||
            `/admin/services/issues-board?serviceRequestId=${encodeURIComponent(
                clean(serviceRequest?.id),
            )}`;
    }

    return { ...event, metadataJson: enriched as Prisma.JsonObject };
}

function renderTemplate(template: string, event: NotificationEventLog) {
    const meta = asRecord(event.metadataJson);

    return String(template ?? "").replace(
        /\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g,
        (_, rawKey: string) => {
            const key = String(rawKey || "").trim();

            const value = getTemplateValue(
                {
                    ...event,
                    ...meta,
                },
                key,
            );

            if (value === null || value === undefined) return "";
            if (Array.isArray(value)) return value.join(", ");
            if (value instanceof Date) return value.toLocaleString("vi-VN");

            return String(value);
        },
    );
}

function templateSource(event: NotificationEventLog) {
    return {
        ...event,
        ...asRecord(event.metadataJson),
    };
}

function extractTemplateKeys(...templates: Array<string | null | undefined>) {
    const keys = new Set<string>();

    for (const template of templates) {
        String(template ?? "").replace(
            /\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g,
            (_match, rawKey: string) => {
                const key = clean(rawKey);
                if (key) keys.add(key);
                return "";
            },
        );
    }

    return Array.from(keys);
}

function templateValueIsMissing(value: unknown) {
    if (value === null || value === undefined) return true;
    if (Array.isArray(value)) return value.length === 0;
    return clean(value) === "";
}

function missingTemplateKeys(rule: NotificationRuleRow, event: NotificationEventLog) {
    const source = templateSource(event);
    return extractTemplateKeys(rule.titleTemplate, rule.messageTemplate).filter((key) =>
        templateValueIsMissing(getTemplateValue(source, key)),
    );
}

function eventInstanceId(event: NotificationEventLog) {
    const meta = asRecord(event.metadataJson);

    return clean(meta.eventInstanceId) || clean(meta.sourceId) || event.id;
}

function getTemplateValue(source: Record<string, unknown>, path: string) {
    return String(path)
        .split(".")
        .reduce((acc, key) => {
            if (acc === null || acc === undefined) return undefined;
            return asRecord(acc)[key];
        }, source as unknown);
}
function matchNotificationRule(rule: NotificationRuleRow, eventLog: NotificationEventLog) {
    const condition = asRecord(rule.conditionJson);
    const payload = asRecord(eventLog.metadataJson);

    if (!Object.keys(condition).length) return true;

    if (condition.targetType && eventLog.targetType !== condition.targetType) {
        return false;
    }

    const eventKeys = jsonArray(condition.eventKeys);
    if (eventKeys.length) {
        if (!eventKeys.includes(eventLog.eventKey)) return false;
    }

    const reviewTargetTypes = jsonArray(condition.reviewTargetTypes);
    if (reviewTargetTypes.length) {
        if (!reviewTargetTypes.includes(String(payload.reviewTargetType ?? ""))) {
            return false;
        }
    }

    const taskKinds = jsonArray(condition.taskKinds);
    if (taskKinds.length > 0) {
        if (!taskKinds.includes(String(payload.taskKind ?? ""))) {
            return false;
        }
    }

    if (condition.taskKind && payload.taskKind !== condition.taskKind) {
        return false;
    }

    if (condition.priority && payload.priority !== condition.priority) {
        return false;
    }

    const priorities = jsonArray(condition.priorities);
    if (priorities.length > 0) {
        if (!priorities.includes(String(payload.priority ?? ""))) {
            return false;
        }
    }

    const tagNames = jsonArray(condition.tagNames);
    if (tagNames.length > 0) {
        const eventTags = jsonArray(payload.tagNames);

        const matched = tagNames.some((tag: string) =>
            eventTags.includes(tag),
        );

        if (!matched) return false;
    }

    return true;
}
function jsonArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function errorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Unknown error";
}

async function resolveGroupUsers(group: NotificationRecipientGroupRow) {
    const userIds = jsonArray(group.userIds);
    const roleNames = jsonArray(group.roleNames);

    const usersByRole = roleNames.length
        ? await findUsersByRoleNames(roleNames)
        : [];

    return Array.from(
        new Set([...userIds, ...usersByRole.map((user) => user.id)]),
    );
}

export async function consumeBusinessEventForNotification(
    client: Prisma.TransactionClient,
    eventLogInput: unknown,
) {
    let eventLog = normalizeEventLog(eventLogInput);

    if (!eventLog.id || !eventLog.eventKey || !eventLog.targetType || !eventLog.targetId) {
        return {
            ok: true,
            skipped: true,
            reason: "INVALID_EVENT_LOG",
            eventKey: eventLog.eventKey,
        };
    }

    eventLog = await enrichNotificationEvent(client, eventLog);

    const rules = await client.notificationRule.findMany({
        where: {
            enabled: true,
            eventKey: eventLog.eventKey,
        },
        orderBy: [{ createdAt: "asc" }],
    });

    if (!rules.length) {
        return {
            ok: true,
            skipped: true,
            reason: "NO_NOTIFICATION_RULE",
            eventKey: eventLog.eventKey,
        };
    }

    const results = [];

    for (const rule of rules) {
        if (!matchNotificationRule(rule, eventLog)) continue;

        const group = await client.notificationRecipientGroup.findUnique({
            where: { key: rule.recipientGroupKey },
        });

        if (!group?.enabled) {
            results.push({
                ok: true,
                skipped: true,
                reason: "NO_ENABLED_RECIPIENT_GROUP",
                ruleId: rule.id,
                recipientGroupKey: rule.recipientGroupKey,
            });
            continue;
        }

        const title = rule.titleTemplate
            ? renderTemplate(rule.titleTemplate, eventLog)
            : rule.name;

        const message = renderTemplate(rule.messageTemplate, eventLog);
        const channelMessage = [title, message].filter(Boolean).join("\n");

        const missingKeys = missingTemplateKeys(rule, eventLog);
        if (missingKeys.length) {
            results.push({
                ok: true,
                skipped: true,
                reason: "MISSING_TEMPLATE_VALUES",
                ruleId: rule.id,
                eventKey: eventLog.eventKey,
                missingKeys,
            });
            continue;
        }

        const instanceId = eventInstanceId(eventLog);
        const existingDispatch = await client.notificationDispatch.findFirst({
            where: {
                businessEventLogId: eventLog.id,
                ruleId: rule.id,
                eventKey: eventLog.eventKey,
                targetType: eventLog.targetType,
                targetId: eventLog.targetId,
                status: { in: ["PENDING", "PARTIAL", "SENT"] },
                payloadJson: {
                    path: ["eventInstanceId"],
                    equals: instanceId,
                },
            },
            select: { id: true, status: true },
        });

        if (existingDispatch) {
            results.push({
                ok: true,
                skipped: true,
                reason: "DUPLICATE_DISPATCH",
                ruleId: rule.id,
                dispatchId: existingDispatch.id,
                status: existingDispatch.status,
            });
            continue;
        }

        const dispatch = await client.notificationDispatch.create({
            data: {
                businessEventLogId: eventLog.id,
                ruleId: rule.id,
                eventKey: eventLog.eventKey,
                targetType: eventLog.targetType,
                targetId: eventLog.targetId,
                status: "PENDING",
                payloadJson: {
                    eventInstanceId: instanceId,
                    title,
                    message,
                    channelMessage,
                    channel: rule.channel,
                    recipientGroupKey: rule.recipientGroupKey,
                },
            },
        });

        const delivery = await client.notificationChannelDelivery.create({
            data: {
                dispatchId: dispatch.id,
                channel: rule.channel,
                recipientGroupKey: rule.recipientGroupKey,
                status: "PENDING",
                payloadJson: { eventInstanceId: instanceId, title, message, channelMessage },
            },
        });

        try {
            if (rule.channel === "IN_APP") {
                const userIds = await resolveGroupUsers(group);

                if (!userIds.length) {
                    throw new Error(`No in-app recipients for ${group.key}`);
                }

                await Promise.all(
                    userIds.map((userId) =>
                        createNotification({
                            userId,
                            type: eventLog.eventKey,
                            title,
                            message,
                            priority: rule.priority === "HIGH" || rule.priority === "LOW"
                                ? rule.priority
                                : "NORMAL",
                            metadata: {
                                businessEventLogId: eventLog.id,
                                targetType: eventLog.targetType,
                                targetId: eventLog.targetId,
                            },
                        }),
                    ),
                );
            }

            if (rule.channel === "ZALO_OA") {
                if (!group.zaloGroupId) {
                    throw new Error(`Missing zaloGroupId for ${group.key}`);
                }

                await sendZaloTextToGroup({
                    groupId: group.zaloGroupId,
                    message: channelMessage,
                });
            }

            await client.notificationChannelDelivery.update({
                where: { id: delivery.id },
                data: {
                    status: "SENT",
                    sentAt: new Date(),
                },
            });

            await client.notificationDispatch.update({
                where: { id: dispatch.id },
                data: {
                    status: "SENT",
                },
            });

            results.push({ ok: true, dispatchId: dispatch.id });
        } catch (error: unknown) {
            const message = errorMessage(error);

            await client.notificationChannelDelivery.update({
                where: { id: delivery.id },
                data: {
                    status: "FAILED",
                    errorMessage: message,
                },
            });

            await client.notificationDispatch.update({
                where: { id: dispatch.id },
                data: {
                    status: "FAILED",
                    errorMessage: message,
                },
            });

            results.push({
                ok: false,
                dispatchId: dispatch.id,
                error: message,
            });
        }
    }

    return results;
}
