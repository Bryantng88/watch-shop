"use client";

import * as React from "react";
import { ChevronRight, Lock, Trash2 } from "lucide-react";
import { Button, Field, SelectInput, TextInput } from "./primitives";
import { formatCurrency, parseMoney } from "./utils";
import {
    ExecutionType,
    MachineType,
    MovementAction,
    MovementLine,
} from "./types";

function BoardStateText(boardText?: string) {
    const normalized = String(boardText || "").toUpperCase();
    if (normalized.includes("DONE") || normalized.includes("COMPLETED")) return "Hoàn tất";
    if (normalized.includes("PROCESS") || normalized.includes("PROGRESS")) return "Đang làm";
    if (normalized.includes("CANCEL")) return "Đã hủy";
    if (normalized.includes("OPEN")) return "Đã mở issue";
    return boardText || "Đã mở issue";
}

function railTone(boardText?: string) {
    const normalized = String(boardText || "").toUpperCase();
    if (normalized.includes("DONE") || normalized.includes("COMPLETED")) return "bg-emerald-500";
    if (normalized.includes("PROCESS") || normalized.includes("PROGRESS")) return "bg-sky-500";
    if (normalized.includes("CANCEL")) return "bg-slate-300";
    return "bg-amber-500";
}

function RowMeta({ items }: { items: Array<string | undefined | null | false> }) {
    const visible = items.filter(Boolean) as string[];
    if (!visible.length) return null;

    return (
        <div className="mt-1 text-xs text-slate-500">
            {visible.join(" • ")}
        </div>
    );
}

export function IssueRow({
    index,
    title,
    modeLabel,
    costText,
    boardText,
    onOpenBoard,
    readOnly = false,
}: {
    index: number;
    title: string;
    modeLabel?: string;
    costText?: string;
    boardText?: string;
    onOpenBoard?: () => void;
    readOnly?: boolean;
}) {
    const status = String(boardText || "").toUpperCase();

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-stretch">
                <div className={`w-1 shrink-0 ${railTone(boardText)}`} />

                <div className="min-w-0 flex-1 px-4 py-4">
                    <div className="grid gap-3 xl:grid-cols-[120px_minmax(0,1.5fr)_180px_auto] xl:items-center">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                <Lock className="h-4 w-4 text-slate-400" />
                                <span>Dòng #{index}</span>
                            </div>
                            <div className="mt-1 text-xs font-medium text-slate-500">
                                {BoardStateText(boardText)}
                            </div>
                        </div>

                        <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-900">{title}</div>
                            <RowMeta items={[modeLabel]} />
                        </div>

                        <div className="text-sm text-slate-600 xl:text-right">
                            <span className="text-slate-500">Chi phí dự kiến </span>
                            <span className="font-semibold text-slate-900">{costText || "0đ"}</span>
                        </div>

                        <div className="flex items-center xl:justify-end">
                            {!readOnly && onOpenBoard ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onOpenBoard}
                                    className="whitespace-nowrap"
                                >
                                    Issue Board
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            ) : (
                                <span className="text-sm italic text-slate-400">
                                    {status.includes("CANCEL") ? "Issue đã hủy" : "Chỉ xem"}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function StaticIssueSummary({
    lineNo,
    summary,
    boardStatus,
    execution,
    cost,
    vendorName,
    partName,
    actionLabel,
    onGoBoard,
    readOnly = false,
}: {
    lineNo: number;
    summary?: string;
    boardStatus?: string;
    execution?: string;
    cost?: string;
    vendorName?: string;
    partName?: string;
    actionLabel?: string;
    onGoBoard: () => void;
    readOnly?: boolean;
}) {
    const metaParts = [
        actionLabel,
        execution ? (execution === "VENDOR" ? "Vendor" : "Nội bộ") : undefined,
        vendorName ? `Vendor: ${vendorName}` : undefined,
        partName ? `Linh kiện: ${partName}` : undefined,
    ].filter(Boolean) as string[];

    return (
        <IssueRow
            index={lineNo}
            title={summary || "Issue đã được ghi nhận và đang theo dõi tại Issue Board"}
            modeLabel={metaParts.join(" • ")}
            boardText={boardStatus}
            costText={cost || "0đ"}
            onOpenBoard={onGoBoard}
            readOnly={readOnly || String(boardStatus || "").toUpperCase() === "CANCELED"}
        />
    );
}

function DraftIssueShell({
    index,
    summary,
    meta,
    costText,
    canRemove,
    onRemove,
    children,
}: {
    index: number;
    summary: string;
    meta?: string;
    costText?: string;
    canRemove: boolean;
    onRemove: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-stretch">
                <div className="w-1 shrink-0 bg-slate-300" />
                <div className="min-w-0 flex-1">
                    <div className="border-b border-slate-100 px-4 py-4">
                        <div className="grid gap-3 xl:grid-cols-[120px_minmax(0,1.5fr)_180px_auto] xl:items-center">
                            <div className="min-w-0">
                                <div className="text-sm font-semibold text-slate-900">Dòng #{index}</div>
                                <div className="mt-1 text-xs font-medium text-slate-400">Đang soạn</div>
                            </div>

                            <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-slate-900">{summary}</div>
                                {meta ? <div className="mt-1 text-xs text-slate-500">{meta}</div> : null}
                            </div>

                            <div className="text-sm text-slate-600 xl:text-right">
                                <span className="text-slate-500">Chi phí dự kiến </span>
                                <span className="font-semibold text-slate-900">{costText || "0đ"}</span>
                            </div>

                            <div className="flex items-center xl:justify-end">
                                {canRemove ? (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="px-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                                        onClick={onRemove}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    <div className="h-8 w-8" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50/50 p-4">{children}</div>
                </div>
            </div>
        </div>
    );
}

export function MovementIssueRow({
    index,
    line,
    machineType,
    parts,
    vendors,
    onChange,
    onRemove,
    canRemove,
    onGoBoard,
    isLocked,
}: {
    index: number;
    line: MovementLine;
    machineType: MachineType;
    parts: any[];
    vendors: any[];
    onChange: (patch: Partial<MovementLine>) => void;
    onRemove: () => void;
    canRemove: boolean;
    onGoBoard: () => void;
    isLocked: boolean;
}) {
    const isVendor = line.execution === "VENDOR";
    const isReplacePart = line.action === "REPLACE_PART";
    const vendorName = vendors.find((v: any) => v.id === line.vendorId)?.name ?? "";
    const partName = parts.find((p: any) => p.id === line.partId)?.name ?? "";

    const actionLabelMap: Record<string, string> = {
        SERVICE: "Lau dầu / service máy",
        REPLACE_PART: "Thay linh kiện",
        REGULATE: "Chỉnh sai số / dây tóc",
        WATERPROOF: "Chống nước",
        REPLACE_MOVEMENT: "Thay máy mới",
        BATTERY_CHANGE: "Thay pin",
    };

    if (line.isFromBoard) {
        return (
            <StaticIssueSummary
                lineNo={index + 1}
                summary={line.summary || (line.action ? actionLabelMap[line.action] || line.action : undefined)}
                boardStatus={line.boardStatus}
                execution={line.execution}
                cost={formatCurrency(parseMoney(line.cost))}
                vendorName={vendorName || line.vendorName}
                partName={partName}
                actionLabel={line.action ? actionLabelMap[line.action] || line.action : undefined}
                onGoBoard={onGoBoard}
                readOnly={isLocked}
            />
        );
    }

    const draftSummary =
        (line.action ? actionLabelMap[line.action] || line.action : undefined) || "Chưa chọn xử lý";
    const meta = [
        line.execution ? (line.execution === "VENDOR" ? "Vendor" : "Nội bộ") : undefined,
        isVendor && vendorName ? `Vendor: ${vendorName}` : undefined,
        isReplacePart && partName ? `Linh kiện: ${partName}` : undefined,
    ]
        .filter(Boolean)
        .join(" • ");

    return (
        <DraftIssueShell
            index={index + 1}
            summary={draftSummary}
            meta={meta}
            costText={formatCurrency(parseMoney(line.cost))}
            canRemove={canRemove}
            onRemove={onRemove}
        >
            <div className="grid gap-4 md:grid-cols-12">
                <div className="md:col-span-5">
                    <Field label="Xử lý">
                        <SelectInput
                            value={line.action ?? ""}
                            onChange={(e) =>
                                onChange({
                                    action: e.target.value as MovementAction,
                                    partId: e.target.value === "REPLACE_PART" ? line.partId : undefined,
                                })
                            }
                            disabled={isLocked}
                        >
                            <option value="">Chọn xử lý</option>
                            {machineType === "MECHANICAL" ? (
                                <>
                                    <option value="SERVICE">Lau dầu / service máy</option>
                                    <option value="REPLACE_PART">Thay linh kiện</option>
                                    <option value="REGULATE">Chỉnh sai số / dây tóc</option>
                                    <option value="WATERPROOF">Chống nước</option>
                                    <option value="REPLACE_MOVEMENT">Thay máy mới</option>
                                </>
                            ) : (
                                <>
                                    <option value="BATTERY_CHANGE">Thay pin</option>
                                    <option value="REPLACE_PART">Thay linh kiện</option>
                                    <option value="WATERPROOF">Chống nước</option>
                                    <option value="REPLACE_MOVEMENT">Thay máy mới</option>
                                </>
                            )}
                        </SelectInput>
                    </Field>
                </div>

                <div className="md:col-span-4">
                    <Field label="Thực hiện">
                        <SelectInput
                            value={line.execution ?? "INHOUSE"}
                            onChange={(e) =>
                                onChange({
                                    execution: e.target.value as ExecutionType,
                                    vendorId: e.target.value === "VENDOR" ? line.vendorId : undefined,
                                })
                            }
                            disabled={isLocked}
                        >
                            <option value="INHOUSE">Nội bộ</option>
                            <option value="VENDOR">Vendor</option>
                        </SelectInput>
                    </Field>
                </div>

                <div className="md:col-span-3">
                    <Field label="Chi phí">
                        <TextInput
                            inputMode="numeric"
                            placeholder="0"
                            value={line.cost ?? ""}
                            onChange={(e) => onChange({ cost: e.target.value })}
                            disabled={isLocked}
                        />
                    </Field>
                </div>
            </div>

            {(isReplacePart || isVendor) ? (
                <div className="mt-4 grid gap-4 md:grid-cols-12">
                    {isReplacePart ? (
                        <div className="md:col-span-5">
                            <Field label="Linh kiện">
                                <SelectInput
                                    value={line.partId ?? ""}
                                    onChange={(e) => onChange({ partId: e.target.value })}
                                    disabled={isLocked}
                                >
                                    <option value="">Chọn linh kiện</option>
                                    {parts.map((part: any) => (
                                        <option key={part.id} value={part.id}>
                                            {part.code ? `${part.code} - ` : ""}{part.name}
                                        </option>
                                    ))}
                                </SelectInput>
                            </Field>
                        </div>
                    ) : (
                        <div className="hidden md:block md:col-span-5" />
                    )}

                    {isVendor ? (
                        <div className="md:col-span-7">
                            <Field label="Vendor">
                                <SelectInput
                                    value={line.vendorId ?? ""}
                                    onChange={(e) => onChange({ vendorId: e.target.value })}
                                    disabled={isLocked}
                                >
                                    <option value="">Chọn vendor</option>
                                    {vendors.map((vendor: any) => (
                                        <option key={vendor.id} value={vendor.id}>
                                            {vendor.name}
                                        </option>
                                    ))}
                                </SelectInput>
                            </Field>
                        </div>
                    ) : null}
                </div>
            ) : null}
        </DraftIssueShell>
    );
}
