"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    ChevronDown,
    ChevronRight,
    Eye,
    EyeOff,
    Pencil,
    Settings2,
    ShieldCheck,
    Wrench,
} from "lucide-react";
import { useNotify } from "@/components/feedback/AppToastProvider";

type ActionItem = {
    id: string;
    code: string;
    name: string;
    appliesTo: string;
    groupKey: string;
    requiresPart: boolean;
    defaultExecutionMode?: string | null;
    sortOrder: number;
    isActive: boolean;
    note?: string | null;
};

type PartItem = {
    id: string;
    code: string;
    name: string;
    appliesTo: string;
    partGroup: string;
    sortOrder: number;
    isActive: boolean;
    note?: string | null;
};

type AppearanceIssueItem = {
    id: string;
    code: string;
    area: string;
    label: string;
    deductionScore: number;
    sortOrder: number;
    isActive: boolean;
    note?: string | null;
};

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function Pill({
    children,
    tone = "gray",
}: {
    children: React.ReactNode;
    tone?: "neutral" | "amber" | "gray" | "red";
}) {
    const styles = {
        neutral: "border-slate-200 bg-slate-50 text-slate-700",
        amber: "border-amber-200 bg-amber-50 text-amber-700",
        gray: "border-slate-200 bg-slate-100 text-slate-700",
        red: "border-red-200 bg-red-50 text-red-700",
    };

    return (
        <span
            className={cx(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                styles[tone]
            )}
        >
            {children}
        </span>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">{label}</label>
            {children}
        </div>
    );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={cx(
                "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition",
                "placeholder:text-slate-400 focus:border-slate-400",
                props.className
            )}
        />
    );
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            {...props}
            className={cx(
                "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400",
                props.className
            )}
        />
    );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className={cx(
                "min-h-[96px] w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition",
                "placeholder:text-slate-400 focus:border-slate-400",
                props.className
            )}
        />
    );
}

function Button({
    children,
    variant = "primary",
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "outline" | "ghost";
}) {
    const styles = {
        primary: "bg-slate-900 text-white hover:bg-slate-800 border-slate-900",
        outline: "bg-white text-slate-900 border-slate-200 hover:bg-slate-50",
        ghost: "bg-transparent text-slate-700 border-transparent hover:bg-slate-100",
    };

    return (
        <button
            {...props}
            className={cx(
                "inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium transition disabled:opacity-50",
                styles[variant],
                className
            )}
        >
            {children}
        </button>
    );
}

function CollapsibleSectionCard({
    title,
    icon,
    badge,
    description,
    defaultOpen = true,
    children,
}: {
    title: string;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    description?: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = React.useState(defaultOpen);

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 text-left hover:bg-slate-50"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        {icon}
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                        {description ? (
                            <p className="mt-1 text-sm text-slate-500">{description}</p>
                        ) : null}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {badge}
                    {open ? (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                    )}
                </div>
            </button>

            {open ? <div className="space-y-5 p-5">{children}</div> : null}
        </section>
    );
}

function CollapsibleEditorCard({
    title,
    subtitle,
    editing,
    defaultOpen = true,
    children,
}: {
    title: string;
    subtitle?: string;
    editing?: boolean;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = React.useState(defaultOpen);

    React.useEffect(() => {
        if (editing) setOpen(true);
    }, [editing]);

    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-3 text-left"
            >
                <div>
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    {subtitle ? (
                        <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
                    ) : null}
                </div>

                <div className="flex items-center gap-2">
                    {editing ? <Pill tone="amber">Đang sửa</Pill> : null}
                    {open ? (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                    )}
                </div>
            </button>

            {open ? <div className="mt-4">{children}</div> : null}
        </div>
    );
}

function emptyActionForm() {
    return {
        id: "",
        code: "",
        name: "",
        appliesTo: "BOTH",
        groupKey: "MOVEMENT",
        requiresPart: false,
        defaultExecutionMode: "INTERNAL",
        sortOrder: 0,
        isActive: true,
        note: "",
    };
}

function emptyPartForm() {
    return {
        id: "",
        code: "",
        name: "",
        appliesTo: "BOTH",
        partGroup: "MOVEMENT",
        sortOrder: 0,
        isActive: true,
        note: "",
    };
}

function emptyAppearanceForm() {
    return {
        id: "",
        code: "",
        area: "CASE",
        label: "",
        deductionScore: 0,
        sortOrder: 0,
        isActive: true,
        note: "",
    };
}

export default function TechnicalCatalogManagerClient({
    initialData,
}: {
    initialData: {
        actions: ActionItem[];
        parts: PartItem[];
        appearanceIssues: AppearanceIssueItem[];
    };
}) {
    const router = useRouter();

    const [actionForm, setActionForm] = React.useState(emptyActionForm());
    const [partForm, setPartForm] = React.useState(emptyPartForm());
    const [appearanceForm, setAppearanceForm] = React.useState(emptyAppearanceForm());

    const [editingActionId, setEditingActionId] = React.useState<string | null>(null);
    const [editingPartId, setEditingPartId] = React.useState<string | null>(null);
    const [editingAppearanceId, setEditingAppearanceId] = React.useState<string | null>(null);

    const [submitting, setSubmitting] = React.useState<string | null>(null);
    const notify = useNotify();

    const [form, setForm] = React.useState({
        id: "",
        name: "",
        appliesTo: "MECHANICAL",
        group: "MOVEMENT",
        sortOrder: 0,
        note: "",
        isActive: true,
    });
    const [saving, setSaving] = React.useState(false);
    async function save(
        kind: "action" | "part" | "appearanceIssue",
        body: any
    ) {
        const res = await fetch(`/api/admin/technical-catalogs/${kind}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.error || "Save failed");
        }

        router.refresh();
    }

    async function handleSaveAction() {
        try {
            setSubmitting("action");
            await save("action", actionForm);
            setActionForm(emptyActionForm());
            setEditingActionId(null);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Lưu action thất bại");
        } finally {
            setSubmitting(null);
        }
    }

    async function handleSavePart() {
        try {
            setSubmitting("part");
            await save("part", partForm);
            setPartForm(emptyPartForm());
            setEditingPartId(null);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Lưu part thất bại");
        } finally {
            setSubmitting(null);
        }
    }

    async function handleSaveAppearance() {
        try {
            setSubmitting("appearance");
            await save("appearanceIssue", appearanceForm);
            setAppearanceForm(emptyAppearanceForm());
            setEditingAppearanceId(null);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Lưu issue thất bại");
        } finally {
            setSubmitting(null);
        }
    }

    function startEditAction(item: ActionItem) {
        setEditingActionId(item.id);
        setActionForm({
            id: item.id,
            code: item.code,
            name: item.name,
            appliesTo: item.appliesTo,
            groupKey: item.groupKey,
            requiresPart: item.requiresPart,
            defaultExecutionMode: item.defaultExecutionMode ?? "INTERNAL",
            sortOrder: item.sortOrder ?? 0,
            isActive: item.isActive,
            note: item.note ?? "",
        });
    }

    function startEditPart(item: PartItem) {
        setEditingPartId(item.id);
        setPartForm({
            id: item.id,
            code: item.code,
            name: item.name,
            appliesTo: item.appliesTo,
            partGroup: item.partGroup,
            sortOrder: item.sortOrder ?? 0,
            isActive: item.isActive,
            note: item.note ?? "",
        });
    }

    function startEditAppearance(item: AppearanceIssueItem) {
        setEditingAppearanceId(item.id);
        setAppearanceForm({
            id: item.id,
            code: item.code,
            area: item.area,
            label: item.label,
            deductionScore: item.deductionScore ?? 0,
            sortOrder: item.sortOrder ?? 0,
            isActive: item.isActive,
            note: item.note ?? "",
        });
    }

    async function toggleActionActive(item: ActionItem) {
        try {
            await save("action", {
                ...item,
                isActive: !item.isActive,
            });
        } catch (error) {
            alert(error instanceof Error ? error.message : "Cập nhật thất bại");
        }
    }

    async function togglePartActive(item: PartItem) {
        try {
            await save("part", {
                ...item,
                isActive: !item.isActive,
            });
        } catch (error) {
            alert(error instanceof Error ? error.message : "Cập nhật thất bại");
        }
    }

    async function toggleAppearanceActive(item: AppearanceIssueItem) {
        try {
            await save("appearanceIssue", {
                ...item,
                isActive: !item.isActive,
            });
        } catch (error) {
            alert(error instanceof Error ? error.message : "Cập nhật thất bại");
        }
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.name.trim()) {
            notify.error({
                title: "Thiếu dữ liệu",
                message: "Vui lòng nhập tên linh kiện.",
            });
            return;
        }

        try {
            setSaving(true);

            const payload = {
                name: form.name,
                appliesTo: form.appliesTo,
                group: form.group,
                sortOrder: Number(form.sortOrder || 0),
                note: form.note,
                isActive: form.isActive,
            };

            const isEdit = Boolean(form.id);
            const url = isEdit
                ? `/api/admin/catalogs/technical/parts/${form.id}`
                : `/api/admin/catalogs/technical/parts`;

            const method = isEdit ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(json?.error || "Không thể lưu linh kiện");
            }

            notify.success({
                title: isEdit ? "Đã cập nhật linh kiện" : "Đã tạo linh kiện",
                message: isEdit
                    ? "Thông tin linh kiện đã được cập nhật."
                    : "Linh kiện mới đã được tạo thành công.",
            });

            setForm({
                id: "",
                name: "",
                appliesTo: "MECHANICAL",
                group: "MOVEMENT",
                sortOrder: 0,
                note: "",
                isActive: true,
            });

            router.refresh();
        } catch (error: any) {
            notify.error({
                title: "Lưu linh kiện thất bại",
                message: error?.message || "Đã có lỗi xảy ra.",
            });
        } finally {
            setSaving(false);
        }
    }
    const activeActionCount = initialData.actions.filter((x) => x.isActive).length;
    const activePartCount = initialData.parts.filter((x) => x.isActive).length;
    const activeIssueCount = initialData.appearanceIssues.filter((x) => x.isActive).length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                    Technical Catalogs
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Quản lý action, linh kiện và khuyết điểm ngoại hình dùng cho Technical Assessment.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                    <Pill tone="neutral">Action active: {activeActionCount}</Pill>
                    <Pill tone="neutral">Part active: {activePartCount}</Pill>
                    <Pill tone="neutral">Issue active: {activeIssueCount}</Pill>
                </div>
            </div>

            <CollapsibleSectionCard
                title="Action Catalog"
                icon={<Settings2 className="h-5 w-5" />}
                description="Danh mục nghiệp vụ kỹ thuật cho movement / crown / cosmetic"
                badge={<Pill tone="gray">{initialData.actions.length} mục</Pill>}
                defaultOpen
            >
                <CollapsibleEditorCard
                    title={editingActionId ? "Chỉnh sửa action" : "Thêm action"}
                    subtitle="Dùng cho dropdown xử lý máy / núm trong Technical Assessment."
                    editing={!!editingActionId}
                    defaultOpen
                >
                    <div className="grid gap-4 md:grid-cols-4">
                        <Field label="Code">
                            <TextInput
                                value={actionForm.code}
                                onChange={(e) =>
                                    setActionForm((p) => ({ ...p, code: e.target.value }))
                                }
                            />
                        </Field>

                        <Field label="Name">
                            <TextInput
                                value={actionForm.name}
                                onChange={(e) =>
                                    setActionForm((p) => ({ ...p, name: e.target.value }))
                                }
                            />
                        </Field>

                        <Field label="Applies">
                            <SelectInput
                                value={actionForm.appliesTo}
                                onChange={(e) =>
                                    setActionForm((p) => ({ ...p, appliesTo: e.target.value }))
                                }
                            >
                                <option value="BOTH">BOTH</option>
                                <option value="MECHANICAL">MECHANICAL</option>
                                <option value="QUARTZ">QUARTZ</option>
                            </SelectInput>
                        </Field>

                        <Field label="Group">
                            <SelectInput
                                value={actionForm.groupKey}
                                onChange={(e) =>
                                    setActionForm((p) => ({ ...p, groupKey: e.target.value }))
                                }
                            >
                                <option value="MOVEMENT">MOVEMENT</option>
                                <option value="CROWN">CROWN</option>
                                <option value="COSMETIC">COSMETIC</option>
                            </SelectInput>
                        </Field>

                        <Field label="Default execution">
                            <SelectInput
                                value={actionForm.defaultExecutionMode}
                                onChange={(e) =>
                                    setActionForm((p) => ({
                                        ...p,
                                        defaultExecutionMode: e.target.value,
                                    }))
                                }
                            >
                                <option value="INTERNAL">INTERNAL</option>
                                <option value="VENDOR">VENDOR</option>
                            </SelectInput>
                        </Field>

                        <Field label="Sort order">
                            <TextInput
                                type="number"
                                value={actionForm.sortOrder}
                                onChange={(e) =>
                                    setActionForm((p) => ({
                                        ...p,
                                        sortOrder: Number(e.target.value || 0),
                                    }))
                                }
                            />
                        </Field>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Options</label>
                            <div className="flex h-11 items-center gap-4 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={actionForm.requiresPart}
                                        onChange={(e) =>
                                            setActionForm((p) => ({
                                                ...p,
                                                requiresPart: e.target.checked,
                                            }))
                                        }
                                    />
                                    Requires part
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={actionForm.isActive}
                                        onChange={(e) =>
                                            setActionForm((p) => ({
                                                ...p,
                                                isActive: e.target.checked,
                                            }))
                                        }
                                    />
                                    Active
                                </label>
                            </div>
                        </div>

                        <div />

                        <div className="md:col-span-4">
                            <Field label="Note">
                                <TextArea
                                    value={actionForm.note}
                                    onChange={(e) =>
                                        setActionForm((p) => ({ ...p, note: e.target.value }))
                                    }
                                />
                            </Field>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                        <Button onClick={handleSaveAction} disabled={submitting === "action"}>
                            {submitting === "action"
                                ? "Đang lưu..."
                                : editingActionId
                                    ? "Cập nhật action"
                                    : "Lưu action"}
                        </Button>

                        {editingActionId ? (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setEditingActionId(null);
                                    setActionForm(emptyActionForm());
                                }}
                            >
                                Hủy sửa
                            </Button>
                        ) : null}
                    </div>
                </CollapsibleEditorCard>

                <div className="space-y-3">
                    {initialData.actions.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="text-sm font-semibold text-slate-900">
                                            {item.name}
                                        </div>
                                        <Pill tone="gray">{item.code}</Pill>
                                        <Pill tone="neutral">{item.appliesTo}</Pill>
                                        <Pill tone="gray">{item.groupKey}</Pill>
                                        {item.requiresPart ? <Pill tone="amber">Requires part</Pill> : null}
                                        <Pill tone={item.isActive ? "neutral" : "red"}>
                                            {item.isActive ? "Active" : "Inactive"}
                                        </Pill>
                                    </div>

                                    <div className="text-sm text-slate-500">
                                        Default execution: {item.defaultExecutionMode || "-"} · Sort:{" "}
                                        {item.sortOrder ?? 0}
                                    </div>

                                    {item.note ? (
                                        <div className="text-sm text-slate-600">{item.note}</div>
                                    ) : null}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="outline" onClick={() => startEditAction(item)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Sửa
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => toggleActionActive(item)}
                                    >
                                        {item.isActive ? (
                                            <>
                                                <EyeOff className="mr-2 h-4 w-4" />
                                                Ẩn
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Bật lại
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CollapsibleSectionCard>

            <CollapsibleSectionCard
                title="Part Catalog"
                icon={<Wrench className="h-5 w-5" />}
                description="Danh mục linh kiện dùng trong technical assessment"
                badge={<Pill tone="gray">{initialData.parts.length} mục</Pill>}
                defaultOpen={false}
            >
                <CollapsibleEditorCard
                    title={editingPartId ? "Chỉnh sửa part" : "Thêm part"}
                    subtitle="Dùng cho dropdown linh kiện trong Technical Assessment."
                    editing={!!editingPartId}
                    defaultOpen={false}
                >
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Code</label>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500">
                                Hệ thống tự sinh code
                            </div>
                        </div>

                        <Field label="Name">
                            <TextInput
                                value={partForm.name}
                                onChange={(e) =>
                                    setPartForm((p) => ({ ...p, name: e.target.value }))
                                }
                            />
                        </Field>

                        <Field label="Applies">
                            <SelectInput
                                value={partForm.appliesTo}
                                onChange={(e) =>
                                    setPartForm((p) => ({ ...p, appliesTo: e.target.value }))
                                }
                            >
                                <option value="BOTH">BOTH</option>
                                <option value="MECHANICAL">MECHANICAL</option>
                                <option value="QUARTZ">QUARTZ</option>
                            </SelectInput>
                        </Field>

                        <Field label="Group">
                            <SelectInput
                                value={partForm.partGroup}
                                onChange={(e) =>
                                    setPartForm((p) => ({ ...p, partGroup: e.target.value }))
                                }
                            >
                                <option value="MOVEMENT">MOVEMENT</option>
                                <option value="CROWN">CROWN</option>
                                <option value="GENERAL">GENERAL</option>
                            </SelectInput>
                        </Field>

                        <Field label="Sort order">
                            <TextInput
                                type="number"
                                value={partForm.sortOrder}
                                onChange={(e) =>
                                    setPartForm((p) => ({
                                        ...p,
                                        sortOrder: Number(e.target.value || 0),
                                    }))
                                }
                            />
                        </Field>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Options</label>
                            <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={partForm.isActive}
                                        onChange={(e) =>
                                            setPartForm((p) => ({
                                                ...p,
                                                isActive: e.target.checked,
                                            }))
                                        }
                                    />
                                    Active
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-4">
                            <Field label="Note">
                                <TextArea
                                    value={partForm.note}
                                    onChange={(e) =>
                                        setPartForm((p) => ({ ...p, note: e.target.value }))
                                    }
                                />
                            </Field>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                        <Button onClick={handleSavePart} disabled={submitting === "part"}>
                            {submitting === "part"
                                ? "Đang lưu..."
                                : editingPartId
                                    ? "Cập nhật part"
                                    : "Lưu part"}
                        </Button>

                        {editingPartId ? (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setEditingPartId(null);
                                    setPartForm(emptyPartForm());
                                }}
                            >
                                Hủy sửa
                            </Button>
                        ) : null}
                    </div>
                </CollapsibleEditorCard>

                <div className="space-y-3">
                    {initialData.parts.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="text-sm font-semibold text-slate-900">
                                            {item.name}
                                        </div>
                                        <Pill tone="gray">{item.code}</Pill>
                                        <Pill tone="neutral">{item.appliesTo}</Pill>
                                        <Pill tone="gray">{item.partGroup}</Pill>
                                        <Pill tone={item.isActive ? "neutral" : "red"}>
                                            {item.isActive ? "Active" : "Inactive"}
                                        </Pill>
                                    </div>

                                    <div className="text-sm text-slate-500">
                                        Sort: {item.sortOrder ?? 0}
                                    </div>

                                    {item.note ? (
                                        <div className="text-sm text-slate-600">{item.note}</div>
                                    ) : null}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="outline" onClick={() => startEditPart(item)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Sửa
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => togglePartActive(item)}
                                    >
                                        {item.isActive ? (
                                            <>
                                                <EyeOff className="mr-2 h-4 w-4" />
                                                Ẩn
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Bật lại
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CollapsibleSectionCard>

            <CollapsibleSectionCard
                title="Appearance Issue Catalog"
                icon={<ShieldCheck className="h-5 w-5" />}
                description="Danh mục khuyết điểm ngoại hình và điểm trừ"
                badge={<Pill tone="gray">{initialData.appearanceIssues.length} mục</Pill>}
                defaultOpen={false}
            >
                <CollapsibleEditorCard
                    title={editingAppearanceId ? "Chỉnh sửa issue" : "Thêm issue"}
                    subtitle="Dùng cho block khuyết điểm ngoại hình trong Technical Assessment."
                    editing={!!editingAppearanceId}
                    defaultOpen={false}
                >
                    <div className="grid gap-4 md:grid-cols-4">
                        <Field label="Code">
                            <TextInput
                                value={appearanceForm.code}
                                onChange={(e) =>
                                    setAppearanceForm((p) => ({ ...p, code: e.target.value }))
                                }
                            />
                        </Field>

                        <Field label="Area">
                            <SelectInput
                                value={appearanceForm.area}
                                onChange={(e) =>
                                    setAppearanceForm((p) => ({ ...p, area: e.target.value }))
                                }
                            >
                                <option value="CASE">CASE</option>
                                <option value="CRYSTAL">CRYSTAL</option>
                                <option value="DIAL">DIAL</option>
                            </SelectInput>
                        </Field>

                        <Field label="Label">
                            <TextInput
                                value={appearanceForm.label}
                                onChange={(e) =>
                                    setAppearanceForm((p) => ({ ...p, label: e.target.value }))
                                }
                            />
                        </Field>

                        <Field label="Deduction score">
                            <TextInput
                                type="number"
                                value={appearanceForm.deductionScore}
                                onChange={(e) =>
                                    setAppearanceForm((p) => ({
                                        ...p,
                                        deductionScore: Number(e.target.value || 0),
                                    }))
                                }
                            />
                        </Field>

                        <Field label="Sort order">
                            <TextInput
                                type="number"
                                value={appearanceForm.sortOrder}
                                onChange={(e) =>
                                    setAppearanceForm((p) => ({
                                        ...p,
                                        sortOrder: Number(e.target.value || 0),
                                    }))
                                }
                            />
                        </Field>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Options</label>
                            <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={appearanceForm.isActive}
                                        onChange={(e) =>
                                            setAppearanceForm((p) => ({
                                                ...p,
                                                isActive: e.target.checked,
                                            }))
                                        }
                                    />
                                    Active
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-4">
                            <Field label="Note">
                                <TextArea
                                    value={appearanceForm.note}
                                    onChange={(e) =>
                                        setAppearanceForm((p) => ({ ...p, note: e.target.value }))
                                    }
                                />
                            </Field>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                        <Button
                            onClick={handleSaveAppearance}
                            disabled={submitting === "appearance"}
                        >
                            {submitting === "appearance"
                                ? "Đang lưu..."
                                : editingAppearanceId
                                    ? "Cập nhật issue"
                                    : "Lưu issue"}
                        </Button>

                        {editingAppearanceId ? (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setEditingAppearanceId(null);
                                    setAppearanceForm(emptyAppearanceForm());
                                }}
                            >
                                Hủy sửa
                            </Button>
                        ) : null}
                    </div>
                </CollapsibleEditorCard>

                <div className="space-y-3">
                    {initialData.appearanceIssues.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="text-sm font-semibold text-slate-900">
                                            {item.label}
                                        </div>
                                        <Pill tone="gray">{item.code}</Pill>
                                        <Pill tone="neutral">{item.area}</Pill>
                                        <Pill tone="amber">-{item.deductionScore}</Pill>
                                        <Pill tone={item.isActive ? "neutral" : "red"}>
                                            {item.isActive ? "Active" : "Inactive"}
                                        </Pill>
                                    </div>

                                    <div className="text-sm text-slate-500">
                                        Sort: {item.sortOrder ?? 0}
                                    </div>

                                    {item.note ? (
                                        <div className="text-sm text-slate-600">{item.note}</div>
                                    ) : null}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => startEditAppearance(item)}
                                    >
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Sửa
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => toggleAppearanceActive(item)}
                                    >
                                        {item.isActive ? (
                                            <>
                                                <EyeOff className="mr-2 h-4 w-4" />
                                                Ẩn
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Bật lại
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CollapsibleSectionCard>
        </div>
    );
}