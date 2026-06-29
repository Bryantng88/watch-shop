
import { createNotification } from "../notification.repo";
import { findUsersByRoleNames } from "@/app/(admin)/admin/users/_server/user.repo";
import { sendZaloTextToGroup } from "./channels/zalo";
function renderTemplate(template: string, event: any) {
    const meta = event.metadataJson ?? {};

    return template
        .replaceAll("{{eventKey}}", event.eventKey ?? "")
        .replaceAll("{{targetType}}", event.targetType ?? "")
        .replaceAll("{{targetId}}", event.targetId ?? "")
        .replaceAll("{{title}}", meta.title ?? "")
        .replaceAll("{{refNo}}", meta.refNo ?? "")
        .replaceAll("{{message}}", meta.message ?? "");
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
        const group = await client.notificationRecipientGroup.findUnique({
            where: { key: rule.recipientGroupKey },
        });

        if (!group?.enabled) continue;

        const title = rule.titleTemplate
            ? renderTemplate(rule.titleTemplate, eventLog)
            : rule.name;

        const message = renderTemplate(rule.messageTemplate, eventLog);

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