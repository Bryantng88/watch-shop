"use client";
import { AdminListFooter } from "@/domains/shared/ui/admin-design-contract/AdminListFooter";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { StrapListProjectionRow } from "@/domains/projection/server/strap-list";
import { BusinessListFilterBar } from "@/domains/shared/ui/business-list";
import type { FilterBarField, FilterBarValues } from "@/domains/shared/ui/filter-bar";
import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { ADMIN_OPERATION_LIST_STYLE } from "@/domains/shared/ui/admin-design-contract/AdminOperationList";
import styles from "./StrapInventoryTable.module.css";

const materialLabels: Record<string, string> = { LEATHER: "Dây da", BRACELET: "Dây thép", RUBBER: "Cao su", NATO: "NATO", CANVASS: "Vải / Canvas", SPECIAL: "Khác" };
const leatherLabels: Record<string, string> = { COW: "Da bò", CROCODILE: "Da cá sấu", OSTRICH: "Da đà điểu", LIZARD: "Da kỳ đà", GOAT: "Da dê", OTHER: "Da khác" };
const emptyFilters: FilterBarValues = { q: "", material: "", leatherType: "", origin: "", size: "", color: "", status: "" };
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLocaleLowerCase("vi-VN").trim();
function optionValues(rows: StrapListProjectionRow[], pick: (row: StrapListProjectionRow) => string | null) {
  return [...new Set(rows.map(pick).filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b, "vi"));
}
function rowStatus(row: StrapListProjectionRow) { return row.attachedWatch ? "ATTACHED" : row.lowStock ? "LOW_STOCK" : "AVAILABLE"; }

export default function StrapInventoryTable({ rows }: { rows: StrapListProjectionRow[] }) {
  const [values, setValues] = useState<FilterBarValues>(emptyFilters);
  const [applied, setApplied] = useState<FilterBarValues>(emptyFilters);
  const fields = useMemo(() => {
    const options = (key: string, label: string, values: string[], labels: Record<string, string> = {}): FilterBarField => ({ key, label, type: "select", options: [{ value: "", label: `${label}: Tất cả` }, ...values.map(value => ({ value, label: labels[value] ?? value }))] });
    return [
      options("material", "Loại dây", optionValues(rows, r => r.material), materialLabels),
      options("size", "Kích thước", optionValues(rows, r => String(r.lugWidthMM)), Object.fromEntries(rows.map(r => [String(r.lugWidthMM), `${r.lugWidthMM} mm`]))),
      options("status", "Trạng thái", ["AVAILABLE", "LOW_STOCK", "ATTACHED"], { AVAILABLE: "Sẵn sàng", LOW_STOCK: "Sắp hết", ATTACHED: "Đang gắn đồng hồ" }),
      options("leatherType", "Loại da", optionValues(rows, r => r.leatherType), leatherLabels),
      options("origin", "Nguồn gốc", ["OEM", "AFTERMARKET"], { OEM: "Chính hãng", AFTERMARKET: "Linh kiện" }),
      options("color", "Màu", optionValues(rows, r => r.color)),
    ];
  }, [rows]);
  const filteredRows = useMemo(() => rows.filter(row => {
    const haystack = normalize([row.title, row.sku, row.color, row.brandName, row.lugWidthMM, row.buckleWidthMM, materialLabels[row.material] ?? row.material, leatherLabels[row.leatherType ?? ""] ?? row.leatherType].filter(v => v != null).join(" "));
    return (!applied.q || haystack.includes(normalize(applied.q)))
      && (!applied.material || row.material === applied.material)
      && (!applied.leatherType || row.leatherType === applied.leatherType)
      && (!applied.origin || row.originType === applied.origin)
      && (!applied.size || String(row.lugWidthMM) === applied.size)
      && (!applied.color || row.color === applied.color)
      && (!applied.status || rowStatus(row) === applied.status);
  }), [rows, applied]);
  const reset = () => { setValues(emptyFilters); setApplied(emptyFilters); };
  const clearField = (key: string) => { setValues(current => ({ ...current, [key]: "" })); setApplied(current => ({ ...current, [key]: "" })); };
  const stocked = rows.filter(row => row.inventoryPolicy === "STOCKED");
  const lowStock = stocked.filter(row => row.lowStock).length;
  const attached = rows.filter(row => row.attachedWatch).length;
  return <section aria-label="Danh sách dây đồng hồ" className={styles.list} style={ADMIN_OPERATION_LIST_STYLE}>
    <BusinessListFilterBar variant="flat" values={values}
      search={{ key: "q", placeholder: "Tìm tên dây, SKU, hãng, màu, kích thước…" }}
      primaryFields={fields.slice(0, 3)} advancedFields={fields.slice(3)}
      onChange={patch => setValues(current => ({ ...current, ...patch }))} onApply={() => setApplied({ ...values })} onClearField={clearField} onClearAll={reset} />
    <table className={styles.table}>
      <caption className="sr-only">Dây đồng hồ, kích thước, nguồn, tồn kho và tình trạng</caption>
      <thead><tr><th scope="col">Dây đồng hồ</th><th scope="col">Kích thước</th><th scope="col">Nguồn</th><th scope="col" className={styles.stock}>Tồn kho</th><th scope="col">Tình trạng</th></tr></thead>
      <tbody>{filteredRows.map(row => <tr key={row.variantId}>
        <td className={styles.identity}>
          <Link href={`/admin/straps/${row.variantId}`} className={styles.title}>{row.title}</Link>
          <p className={styles.metadata}>{row.sku || "Chưa có SKU"}{row.brandName ? ` · ${row.brandName}` : ""}</p>
          <p className={styles.metadata}>{[materialLabels[row.material] ?? row.material, row.material === "LEATHER" ? (leatherLabels[row.leatherType ?? ""] ?? row.leatherType) : null, row.color].filter(Boolean).join(" · ")}</p>
        </td>
        <td data-label="Kích thước"><span>Càng {row.lugWidthMM} mm</span><p className={styles.metadata}>{row.buckleWidthMM == null ? "Chưa rõ cỡ khóa" : `Khóa ${row.buckleWidthMM} mm`}</p></td>
        <td data-label="Nguồn">{row.originType === "OEM" ? "Chính hãng" : row.originType === "AFTERMARKET" ? "Linh kiện" : row.originType || "—"}</td>
        <td data-label="Tồn kho" className={styles.stock}>{row.inventoryPolicy === "NON_STOCK" ? <span className={styles.metadata}>Không theo dõi tồn</span> : <><strong className={row.lowStock ? styles.warning : undefined}>{row.stockQty.toLocaleString("vi-VN")}</strong><p className={styles.metadata}>chiếc</p></>}</td>
        <td data-label="Tình trạng">{row.attachedWatch ? <><span className={styles.metadata}>Đang gắn đồng hồ</span><Link className={styles.watchLink} href={`/admin/watches/${row.attachedWatch.productId}`}>{row.attachedWatch.title}</Link></> : row.lowStock ? <span className={styles.warning}>Sắp hết</span> : <span className={styles.ready}>Sẵn sàng</span>}</td>
      </tr>)}</tbody>
    </table>
    <AdminListFooter total={filteredRows.length} unit="dây đồng hồ" detail={filteredRows.length !== rows.length ? `Lọc từ ${rows.length.toLocaleString("vi-VN")} dây đồng hồ` : undefined} />
    <p className={styles.summary}><span><strong>{stocked.reduce((sum, row) => sum + row.stockQty, 0).toLocaleString("vi-VN")}</strong> chiếc tồn kho</span>{lowStock > 0 && <span className={styles.warning}>{lowStock} mẫu sắp hết</span>}{attached > 0 && <span>{attached} đang gắn đồng hồ</span>}</p>
    {!filteredRows.length && <div className={styles.empty}><p>{rows.length ? "Không tìm thấy dây đồng hồ phù hợp." : "Chưa có dây đồng hồ trong danh sách."}</p>{rows.length > 0 && <AdminButton variant="quiet" density="compact" type="button" onClick={reset}>Xóa bộ lọc</AdminButton>}</div>}
  </section>;
}
