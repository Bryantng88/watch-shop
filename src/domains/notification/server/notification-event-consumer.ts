
import { createNotification } from "../notification.repo";
import { findUsersByRoleNames } from "@/app/(admin)/admin/users/_server/user.repo";
import { sendZaloTextToGroup } from "./channels/zalo";
function renderTemplate(template: string, event: any) {
    const meta = event.metadataJson ?? {};

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

function getTemplateValue(source: any, path: string) {
    return String(path)
        .split(".")
        .reduce((acc, key) => {
            if (acc === null || acc === undefined) return undefined;
            return acc[key];
        }, source);
}
function matchNotificationRule(rule: any, eventLog: any) {
    const condition = rule.conditionJson as any;
    const payload = eventLog.metadataJson as any;

    if (!condition) return true;

    if (condition.targetType && eventLog.targetType !== condition.targetType) {
        return false;
    }

    if (condition.eventKeys?.length) {
        if (!condition.eventKeys.includes(eventLog.eventKey)) return false;
    }

    if (condition.reviewTargetTypes?.length) {
        if (!condition.reviewTargetTypes.includes(payload?.reviewTargetType)) {
            return false;
        }
    }

    if (Array.isArray(condition.taskKinds) && condition.taskKinds.length > 0) {
        if (!condition.taskKinds.includes(payload?.taskKind)) {
            return false;
        }
    }

    if (condition.taskKind && payload?.taskKind !== condition.taskKind) {
        return false;
    }

    if (condition.priority && payload?.priority !== condition.priority) {
        return false;
    }

    if (Array.isArray(condition.priorities) && condition.priorities.length > 0) {
        if (!condition.priorities.includes(payload?.priority)) {
            return false;
        }
    }

    if (Array.isArray(condition.tagNames) && condition.tagNames.length > 0) {
        const eventTags = Array.isArray(payload?.tagNames) ? payload.tagNames : [];

        const matched = condition.tagNames.some((tag: string) =>
            eventTags.includes(tag),
        );

        if (!matched) return false;
    }

    return true;
}
function jsonArray(value: any): string[] {
    return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

async function resolveGroupUsers(group: any) {
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
    client: any,
    eventLog: any,
) {
    const rules = await client.notificationRule.findMany({
        where: {
            enabled: true,
            eventKey: eventLog.eventKey,
        },
        orderBy: [{ createdAt: "asc" }],
    });

    const results = [];

    for (const rule of rules) {
        if (!matchNotificationRule(rule, eventLog)) continue;

        const group = await client.notificationRecipientGroup.findUnique({
            where: { key: rule.recipientGroupKey },
        });

        if (!group?.enabled) continue;

        const title = rule.titleTemplate
            ? renderTemplate(rule.titleTemplate, eventLog)
            : rule.name;

        const message = renderTemplate(rule.messageTemplate, eventLog);

        // giữ nguyên phần dispatch/delivery/gửi Zalo bên dưới


        const dispatch = await client.notificationDispatch.create({
            data: {
                businessEventLogId: eventLog.id,
                ruleId: rule.id,
                eventKey: eventLog.eventKey,
                targetType: eventLog.targetType,
                targetId: eventLog.targetId,
                status: "PENDING",
                payloadJson: {
                    title,
                    message,
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
                payloadJson: { title, message },
            },
        });

        try {
            if (rule.channel === "IN_APP") {
                const userIds = await resolveGroupUsers(group);

                await Promise.all(
                    userIds.map((userId) =>
                        createNotification({
                            userId,
                            type: eventLog.eventKey,
                            title,
                            message,
                            priority: rule.priority as any,
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
                    message,
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
        } catch (error: any) {
            await client.notificationChannelDelivery.update({
                where: { id: delivery.id },
                data: {
                    status: "FAILED",
                    errorMessage: error?.message || "Unknown error",
                },
            });

            await client.notificationDispatch.update({
                where: { id: dispatch.id },
                data: {
                    status: "FAILED",
                    errorMessage: error?.message || "Unknown error",
                },
            });

            results.push({
                ok: false,
                dispatchId: dispatch.id,
                error: error?.message,
            });
        }
    }

    return results;
}