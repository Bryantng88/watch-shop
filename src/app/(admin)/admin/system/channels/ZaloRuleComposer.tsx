"use client";

import { BellRing } from "lucide-react";
import { useMemo, useState } from "react";

type ComposerEvent = {
    key: string;
    label: string;
    group: string;
    targetType: string;
};

type ComposerGroup = {
    key: string;
    name: string;
    enabled: boolean;
};

type TemplatePreset = {
    key: string;
    label: string;
    title: string;
    message: string;
};

const TEMPLATE_FIELDS = [
    "actorName",
    "eventKey",
    "watchTitle",
    "targetTitle",
    "taskItemTitle",
    "activityTitle",
    "replyBody",
    "route",
    "targetType",
    "targetId",
];

const SAMPLE_VALUES: Record<string, string> = {
    actorName: "Long",
    eventKey: "task.item.activity.commented",
    watchTitle: "Seiko Grand Seiko Quartz Silver",
    targetTitle: "Seiko Grand Seiko Quartz Silver",
    taskItemTitle: "Seiko Grand Seiko Quartz Silver",
    activityTitle: "Media work saved 2/3",
    replyBody: "Can bo sung anh mat so ro hon truoc khi dang.",
    route: "/admin/tasks/items/8154...",
    targetType: "TASK_ITEM",
    targetId: "8154...",
};

const PRESETS: TemplatePreset[] = [
    {
        key: "comment",
        label: "Comment",
        title: "🔔 Thảo luận mới",
        message: "⌚ Watch: {{watchTitle}}\n💬 Nội dung: {{replyBody}}\n🧭 Activity: {{activityTitle}}\n👤 Người gửi: {{actorName}}\n🔗 Mở xử lý: {{route}}",
    },
    {
        key: "work",
        label: "Work update",
        title: "⚡ Cập nhật xử lý",
        message: "⌚ Watch: {{watchTitle}}\n🧭 Activity: {{activityTitle}}\n👤 Người thực hiện: {{actorName}}\n🔗 Mở xử lý: {{route}}",
    },
    {
        key: "compact",
        label: "Compact",
        title: "🔔 {{eventKey}}",
        message: "⌚ {{watchTitle}}\n💬 {{replyBody}}\n🔗 {{route}}",
    },
];

function renderPreview(template: string, eventKey: string) {
    return template.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, key: string) => {
        if (key === "eventKey") return eventKey;
        return SAMPLE_VALUES[key] ?? "";
    });
}

function fieldToken(field: string) {
    return `{{${field}}}`;
}

function inputClasses(extra = "") {
    return [
        "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none",
        "focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
        extra,
    ].join(" ");
}

function labelClasses() {
    return "text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500";
}

export function ZaloRuleComposer({
    action,
    events,
    groups,
}: {
    action: (formData: FormData) => void | Promise<void>;
    events: ComposerEvent[];
    groups: ComposerGroup[];
}) {
    const defaultEvent = events.find((event) => event.key === "task.item.activity.commented") ?? events[0];
    const defaultGroup = groups.find((group) => group.enabled) ?? groups[0];
    const [eventKey, setEventKey] = useState(defaultEvent?.key ?? "");
    const [recipientGroupKey, setRecipientGroupKey] = useState(defaultGroup?.key ?? "");
    const [priority, setPriority] = useState("NORMAL");
    const [enabled, setEnabled] = useState(true);
    const [name, setName] = useState("");
    const [titleTemplate, setTitleTemplate] = useState(PRESETS[0].title);
    const [messageTemplate, setMessageTemplate] = useState(PRESETS[0].message);
    const [conditionJson, setConditionJson] = useState("");
    const [targetField, setTargetField] = useState<"title" | "message">("message");

    const selectedEvent = useMemo(
        () => events.find((event) => event.key === eventKey) ?? defaultEvent,
        [defaultEvent, eventKey, events],
    );

    const previewText = [
        renderPreview(titleTemplate, eventKey),
        renderPreview(messageTemplate, eventKey),
    ].filter(Boolean).join("\n");

    function applyPreset(preset: TemplatePreset) {
        setTitleTemplate(preset.title);
        setMessageTemplate(preset.message);
    }

    function insertField(field: string) {
        const token = fieldToken(field);
        if (targetField === "title") {
            setTitleTemplate((current) => `${current}${current ? " " : ""}${token}`);
            return;
        }

        setMessageTemplate((current) => `${current}${current ? "\n" : ""}${token}`);
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <BellRing className="h-4 w-4" />
                </span>
                <div>
                    <h2 className="font-semibold text-slate-950">Create Zalo notification rule</h2>
                    <p className="text-sm text-slate-500">Build the message from presets, fields, and a live preview.</p>
                </div>
            </div>

            <form action={action} className="grid gap-5 p-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-4">
                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="space-y-1.5">
                            <label className={labelClasses()}>Event</label>
                            <select
                                name="eventKey"
                                required
                                value={eventKey}
                                onChange={(event) => setEventKey(event.target.value)}
                                className={inputClasses()}
                            >
                                {events.map((event) => (
                                    <option key={event.key} value={event.key}>
                                        {event.key}
                                    </option>
                                ))}
                            </select>
                            {selectedEvent ? (
                                <div className="text-xs text-slate-500">
                                    {selectedEvent.group} - {selectedEvent.targetType} - {selectedEvent.label}
                                </div>
                            ) : null}
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClasses()}>Recipient group</label>
                            <select
                                name="recipientGroupKey"
                                required
                                value={recipientGroupKey}
                                onChange={(event) => setRecipientGroupKey(event.target.value)}
                                className={inputClasses()}
                            >
                                {groups.map((group) => (
                                    <option key={group.key} value={group.key}>
                                        {group.key}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClasses()}>Priority</label>
                            <select
                                name="priority"
                                value={priority}
                                onChange={(event) => setPriority(event.target.value)}
                                className={inputClasses()}
                            >
                                <option value="LOW">LOW</option>
                                <option value="NORMAL">NORMAL</option>
                                <option value="HIGH">HIGH</option>
                            </select>
                        </div>

                        <label className="flex items-center gap-2 pt-7 text-sm font-medium text-slate-700">
                            <input
                                name="enabled"
                                type="checkbox"
                                checked={enabled}
                                onChange={(event) => setEnabled(event.target.checked)}
                                className="h-4 w-4 rounded border-slate-300"
                            />
                            Enabled after create
                        </label>
                    </div>

                    <div className="space-y-2">
                        <div className={labelClasses()}>Message preset</div>
                        <div className="flex flex-wrap gap-2">
                            {PRESETS.map((preset) => (
                                <button
                                    key={preset.key}
                                    type="button"
                                    onClick={() => applyPreset(preset)}
                                    className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-400"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className={labelClasses()}>Title line</label>
                        <input
                            name="titleTemplate"
                            value={titleTemplate}
                            onFocus={() => setTargetField("title")}
                            onChange={(event) => setTitleTemplate(event.target.value)}
                            className={inputClasses("font-medium")}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className={labelClasses()}>Message body</label>
                        <textarea
                            name="messageTemplate"
                            required
                            value={messageTemplate}
                            onFocus={() => setTargetField("message")}
                            onChange={(event) => setMessageTemplate(event.target.value)}
                            className="min-h-32 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                            <div className={labelClasses()}>Insert field</div>
                            <div className="text-xs text-slate-500">Target: {targetField}</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {TEMPLATE_FIELDS.map((field) => (
                                <button
                                    key={field}
                                    type="button"
                                    onClick={() => insertField(field)}
                                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                                >
                                    {field}
                                </button>
                            ))}
                        </div>
                    </div>

                    <details className="rounded-lg border border-slate-200 px-3 py-2">
                        <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                            Advanced rule options
                        </summary>
                        <div className="mt-3 grid gap-3 lg:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className={labelClasses()}>Rule name</label>
                                <input
                                    name="name"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder={`Zalo - ${eventKey}`}
                                    className={inputClasses()}
                                />
                            </div>
                            <div className="space-y-1.5 lg:col-span-2">
                                <label className={labelClasses()}>Condition JSON</label>
                                <textarea
                                    name="conditionJson"
                                    value={conditionJson}
                                    onChange={(event) => setConditionJson(event.target.value)}
                                    placeholder={'{\n  "taskKinds": ["BUSINESS"]\n}'}
                                    className="min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                                />
                            </div>
                        </div>
                    </details>

                    <button
                        type="submit"
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        Create rule
                    </button>
                </div>

                <aside className="space-y-3">
                    <div className={labelClasses()}>Zalo preview</div>
                    <div className="rounded-xl bg-slate-950 p-4 text-white shadow-sm">
                        <div className="mb-3 text-xs font-semibold uppercase text-slate-400">Vintic</div>
                        <div className="rounded-lg bg-slate-800 px-4 py-3 text-sm leading-6 shadow">
                            {previewText.split("\n").map((line, index) => (
                                <div key={`${line}-${index}`} className={index === 0 ? "font-semibold" : "text-slate-200"}>
                                    {line || " "}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">
                        Title and body are sent together to Zalo. Fields are replaced from the event payload when the notification is dispatched.
                    </div>
                </aside>
            </form>
        </div>
    );
}
