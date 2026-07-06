import { Radio, Users2 } from "lucide-react";

import {
    refreshZaloTokenAction,
    saveZaloNotificationRuleAction,
    saveZaloRecipientGroupAction,
    setZaloEventEnabledAction,
} from "./actions";
import { ZaloRuleComposer } from "./ZaloRuleComposer";
import { getNotificationChannelSettingsData } from "@/domains/notification/server/channel-settings.service";
import { requirePermission } from "@/server/auth/requirePermission";

function asListText(value: unknown) {
    return Array.isArray(value) ? value.map(String).join(", ") : "";
}

function asJsonText(value: unknown) {
    if (!value || value === null) return "";
    return JSON.stringify(value, null, 2);
}

function payloadTitle(value: unknown) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return "-";
    const record = value as Record<string, unknown>;
    return String(record.title ?? record.message ?? "-");
}

function formatDateTime(value?: string | null) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
    });
}

function statusClasses(enabled: boolean) {
    return enabled
        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
        : "bg-slate-100 text-slate-500 ring-slate-200";
}

function tokenSourceLabel(status: {
    hasEnvRefreshToken: boolean;
    hasStoredRefreshToken: boolean;
}) {
    if (status.hasEnvRefreshToken && status.hasStoredRefreshToken) return "Env + stored";
    if (status.hasEnvRefreshToken) return "Env";
    if (status.hasStoredRefreshToken) return "Stored";
    return "None";
}

function groupRulesByEvent<T extends { eventKey: string }>(rules: T[]) {
    const map = new Map<string, T[]>();

    for (const rule of rules) {
        const current = map.get(rule.eventKey) ?? [];
        current.push(rule);
        map.set(rule.eventKey, current);
    }

    return map;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {children}
        </label>
    );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={[
                "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none",
                "focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
                props.className ?? "",
            ].join(" ")}
        />
    );
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            {...props}
            className={[
                "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none",
                "focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
                props.className ?? "",
            ].join(" ")}
        />
    );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className={[
                "min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none",
                "focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
                props.className ?? "",
            ].join(" ")}
        />
    );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
    return (
        <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
            {children}
        </button>
    );
}

export default async function SystemChannelsPage() {
    await requirePermission("SYSTEM_JOB_VIEW");
    const data = await getNotificationChannelSettingsData();
    const failedCount = data.recentDispatches.filter((item) => item.status === "FAILED").length;
    const rulesByEvent = groupRulesByEvent(data.rules);
    const defaultRecipientGroupKey = data.groups.find((group) => group.enabled)?.key ?? data.groups[0]?.key ?? "";
    const enabledEventCount = data.events.filter((event) =>
        (rulesByEvent.get(event.key) ?? []).some((rule) => rule.enabled),
    ).length;
    const disabledEventCount = data.events.length - enabledEventCount;

    return (
        <main className="space-y-5 p-6">
            <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <span>System</span>
                        <span>/</span>
                        <span>Channels</span>
                    </div>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                        Channel configuration
                    </h1>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Zalo rules
                        </div>
                        <div className="mt-1 text-xl font-semibold text-slate-950">{data.rules.length}</div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Groups
                        </div>
                        <div className="mt-1 text-xl font-semibold text-slate-950">{data.groups.length}</div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Failed
                        </div>
                        <div className="mt-1 text-xl font-semibold text-rose-600">{failedCount}</div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Token
                        </div>
                        <div
                            className={[
                                "mt-1 text-sm font-semibold",
                                data.tokenStatus.hasRefreshToken ? "text-emerald-700" : "text-rose-600",
                            ].join(" ")}
                        >
                            {data.tokenStatus.hasRefreshToken ? "Auto refresh" : "Missing refresh"}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500">
                            Exp {formatDateTime(data.tokenStatus.expiresAt)}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-500">
                            {tokenSourceLabel(data.tokenStatus)}
                        </div>
                    </div>
                </div>
            </header>

            {data.tokenStatus.lastRefreshError ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                    <div>
                        <div className="font-semibold">Zalo token refresh failed: {data.tokenStatus.lastRefreshError}</div>
                        <div className="mt-1 text-rose-700">
                            Refresh token hiện tại đang bị Zalo từ chối. Cấp refresh token mới vào env rồi bấm thử lại.
                        </div>
                    </div>
                    <form action={refreshZaloTokenAction}>
                        <button
                            type="submit"
                            className="inline-flex h-9 items-center justify-center rounded-lg bg-white px-3 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-100"
                        >
                            Try refresh
                        </button>
                    </form>
                </div>
            ) : null}

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
                <div className="space-y-5">
                    <div className="rounded-xl border border-slate-200 bg-white">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                                    <Radio className="h-4 w-4" />
                                </span>
                                <div>
                                    <h2 className="font-semibold text-slate-950">All Zalo events</h2>
                                    <p className="text-sm text-slate-500">Enable or disable outbound notification per event.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-semibold">
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                                    {enabledEventCount} enabled
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                                    {disabledEventCount} disabled
                                </span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[920px] border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                        <th className="w-28 px-5 py-3">State</th>
                                        <th className="px-5 py-3">Event</th>
                                        <th className="px-5 py-3">Configured rules</th>
                                        <th className="w-36 px-5 py-3">Group</th>
                                        <th className="w-28 px-5 py-3">Channel</th>
                                        <th className="w-32 px-5 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {data.events.map((event) => {
                                        const eventRules = rulesByEvent.get(event.key) ?? [];
                                        const isEnabled = eventRules.some((rule) => rule.enabled);
                                        const groupLabel = eventRules.length
                                            ? Array.from(new Set(eventRules.map((rule) => rule.recipientGroupKey))).join(", ")
                                            : defaultRecipientGroupKey || "-";

                                        return (
                                            <tr key={event.key} className="hover:bg-slate-50/70">
                                            <td className="px-5 py-3">
                                                <span
                                                    className={[
                                                        "inline-flex min-w-20 items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                                                        statusClasses(isEnabled),
                                                    ].join(" ")}
                                                >
                                                    {isEnabled ? "Enabled" : "Disabled"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="font-semibold text-slate-950">{event.key}</div>
                                                <div className="mt-0.5 max-w-[320px] truncate text-xs text-slate-500">
                                                    {event.label}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="max-w-[260px] truncate font-medium text-slate-800">
                                                    {eventRules.length ? `${eventRules.length} rule${eventRules.length > 1 ? "s" : ""}` : "Not configured"}
                                                </div>
                                                <div className="mt-0.5 max-w-[260px] truncate text-xs text-slate-500">
                                                    {event.group} - {event.targetType}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 font-medium text-slate-700">
                                                {groupLabel}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                    ZALO_OA
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <form action={setZaloEventEnabledAction}>
                                                    <input type="hidden" name="eventKey" value={event.key} />
                                                    <input type="hidden" name="recipientGroupKey" value={defaultRecipientGroupKey} />
                                                    <input
                                                        type="hidden"
                                                        name="enabled"
                                                        value={isEnabled ? "false" : "true"}
                                                    />
                                                    <button
                                                        type="submit"
                                                        className={[
                                                            "inline-flex h-8 items-center justify-center rounded-lg px-3 text-xs font-semibold transition",
                                                            isEnabled
                                                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                                : "bg-slate-950 text-white hover:bg-slate-800",
                                                        ].join(" ")}
                                                        disabled={!defaultRecipientGroupKey && !isEnabled}
                                                    >
                                                        {isEnabled ? "Disable" : "Enable"}
                                                    </button>
                                                </form>
                                            </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <ZaloRuleComposer
                        action={saveZaloNotificationRuleAction}
                        events={data.events}
                        groups={data.groups.map((group) => ({
                            key: group.key,
                            name: group.name,
                            enabled: group.enabled,
                        }))}
                    />

                    <div className="rounded-xl border border-slate-200 bg-white">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                                <Radio className="h-4 w-4" />
                            </span>
                            <div>
                                <h2 className="font-semibold text-slate-950">Zalo event rules</h2>
                                <p className="text-sm text-slate-500">Edit event routing, template, and enabled state.</p>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {data.rules.map((rule) => (
                                <form
                                    key={rule.id}
                                    action={saveZaloNotificationRuleAction}
                                    className="grid gap-3 px-5 py-4 lg:grid-cols-[1.1fr_1fr_180px]"
                                >
                                    <input type="hidden" name="id" value={rule.id} />
                                    <div className="space-y-1.5">
                                        <FieldLabel>Rule</FieldLabel>
                                        <TextInput name="name" defaultValue={rule.name} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <FieldLabel>Event</FieldLabel>
                                        <SelectInput name="eventKey" defaultValue={rule.eventKey}>
                                            {data.events.map((event) => (
                                                <option key={event.key} value={event.key}>
                                                    {event.key}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </div>
                                    <div className="space-y-1.5">
                                        <FieldLabel>Group</FieldLabel>
                                        <SelectInput name="recipientGroupKey" defaultValue={rule.recipientGroupKey}>
                                            {data.groups.map((group) => (
                                                <option key={group.key} value={group.key}>
                                                    {group.key}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </div>
                                    <div className="space-y-1.5">
                                        <FieldLabel>Title</FieldLabel>
                                        <TextInput name="titleTemplate" defaultValue={rule.titleTemplate ?? ""} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <FieldLabel>Priority</FieldLabel>
                                        <SelectInput name="priority" defaultValue={rule.priority}>
                                            <option value="LOW">LOW</option>
                                            <option value="NORMAL">NORMAL</option>
                                            <option value="HIGH">HIGH</option>
                                        </SelectInput>
                                    </div>
                                    <label className="flex items-center gap-2 pt-7 text-sm font-medium text-slate-700">
                                        <input name="enabled" type="checkbox" defaultChecked={rule.enabled} className="h-4 w-4 rounded border-slate-300" />
                                        Enabled
                                    </label>
                                    <div className="space-y-1.5 lg:col-span-3">
                                        <FieldLabel>Message</FieldLabel>
                                        <TextArea name="messageTemplate" defaultValue={rule.messageTemplate} />
                                    </div>
                                    <div className="space-y-1.5 lg:col-span-3">
                                        <FieldLabel>Condition JSON</FieldLabel>
                                        <TextArea name="conditionJson" defaultValue={asJsonText(rule.conditionJson)} />
                                    </div>
                                    <div className="lg:col-span-3">
                                        <SubmitButton>Save rule</SubmitButton>
                                    </div>
                                </form>
                            ))}
                        </div>
                    </div>
                </div>

                <aside className="space-y-5">
                    <div className="rounded-xl border border-slate-200 bg-white">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                                <Users2 className="h-4 w-4" />
                            </span>
                            <div>
                                <h2 className="font-semibold text-slate-950">Recipient groups</h2>
                                <p className="text-sm text-slate-500">Map system groups to Zalo group IDs.</p>
                            </div>
                        </div>

                        <form action={saveZaloRecipientGroupAction} className="space-y-3 p-5">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <FieldLabel>Key</FieldLabel>
                                    <TextInput name="key" placeholder="OPERATIONS" required />
                                </div>
                                <div className="space-y-1.5">
                                    <FieldLabel>Name</FieldLabel>
                                    <TextInput name="name" placeholder="Operations" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <FieldLabel>Zalo group ID</FieldLabel>
                                <TextInput name="zaloGroupId" placeholder="2dca19e81485fddba494" />
                            </div>
                            <div className="space-y-1.5">
                                <FieldLabel>Role names</FieldLabel>
                                <TextInput name="roleNames" placeholder="ADMIN, SALES" />
                            </div>
                            <div className="space-y-1.5">
                                <FieldLabel>User IDs</FieldLabel>
                                <TextInput name="userIds" placeholder="optional direct user ids" />
                            </div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                <input name="enabled" type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" />
                                Enabled
                            </label>
                            <SubmitButton>Save group</SubmitButton>
                        </form>

                        <div className="divide-y divide-slate-100 border-t border-slate-100">
                            {data.groups.map((group) => (
                                <form key={group.id} action={saveZaloRecipientGroupAction} className="space-y-3 p-5">
                                    <input type="hidden" name="id" value={group.id} />
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <FieldLabel>Key</FieldLabel>
                                            <TextInput name="key" defaultValue={group.key} required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <FieldLabel>Name</FieldLabel>
                                            <TextInput name="name" defaultValue={group.name} />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <FieldLabel>Zalo group ID</FieldLabel>
                                        <TextInput name="zaloGroupId" defaultValue={group.zaloGroupId ?? ""} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <FieldLabel>Role names</FieldLabel>
                                        <TextInput name="roleNames" defaultValue={asListText(group.roleNames)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <FieldLabel>User IDs</FieldLabel>
                                        <TextInput name="userIds" defaultValue={asListText(group.userIds)} />
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                            <input name="enabled" type="checkbox" defaultChecked={group.enabled} className="h-4 w-4 rounded border-slate-300" />
                                            Enabled
                                        </label>
                                        <SubmitButton>Save</SubmitButton>
                                    </div>
                                </form>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white">
                        <div className="border-b border-slate-100 px-5 py-4">
                            <h2 className="font-semibold text-slate-950">Recent Zalo dispatches</h2>
                            <p className="text-sm text-slate-500">Latest outbound attempts and errors.</p>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {data.recentDispatches.map((dispatch) => (
                                <div key={dispatch.id} className="px-5 py-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0 truncate text-sm font-semibold text-slate-950">
                                            {dispatch.eventKey}
                                        </div>
                                        <span
                                            className={[
                                                "rounded-full px-2 py-1 text-[11px] font-semibold",
                                                dispatch.status === "SENT"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : dispatch.status === "FAILED"
                                                        ? "bg-rose-50 text-rose-700"
                                                        : "bg-slate-100 text-slate-600",
                                            ].join(" ")}
                                        >
                                            {dispatch.status}
                                        </span>
                                    </div>
                                    <div className="mt-1 truncate text-sm text-slate-500">
                                        {payloadTitle(dispatch.payloadJson)}
                                    </div>
                                    {dispatch.errorMessage ? (
                                        <div className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                                            {dispatch.errorMessage}
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </section>
        </main>
    );
}
