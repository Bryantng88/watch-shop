"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Save, Search, X } from "lucide-react";
import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { AdminLinkAction } from "@/domains/shared/ui/admin-design-contract/AdminLinkAction";
import {
  AdminManagementPage,
  AdminManagementSection,
  AdminManagementButton,
  AdminManagementField,
  ADMIN_MANAGEMENT as shared,
} from "@/domains/shared/ui/admin-design-contract/AdminManagement";
import {
  AdminWorkspaceHeading,
  AdminWorkspaceHeadingRow,
} from "@/domains/shared/ui/admin-design-contract/AdminWorkspaceHeading";
import {
  ADMIN_SPLIT_WORKSPACE as split,
  ADMIN_SPLIT_WORKSPACE_STYLE,
  useAdminSplitWorkspace,
} from "@/domains/shared/ui/admin-design-contract/AdminSplitWorkspace";
import {
  ADMIN_SPLIT_RESIZE as resize,
  useAdminSplitResize,
} from "@/domains/shared/ui/admin-design-contract/AdminSplitResize";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import {
  PageEditingState,
  PageNotice,
} from "@/domains/shared/feedback/PageFeedback";
import {
  readUiResponse,
  uiFeedbackMessage,
} from "@/domains/shared/feedback/read-ui-response";
import styles from "./RolePermissionManager.module.css";

type PermissionItem = { id: string; code: string; description: string | null };
type RoleItem = {
  id: string;
  name: string;
  description: string | null;
  permissions: PermissionItem[];
};
type RoleDraft = {
  id?: string;
  name: string;
  description: string;
  permissionIds: string[];
};
const empty = (): RoleDraft => ({
  name: "",
  description: "",
  permissionIds: [],
});
const fromRole = (role: RoleItem): RoleDraft => ({
  id: role.id,
  name: role.name,
  description: role.description ?? "",
  permissionIds: role.permissions.map((permission) => permission.id),
});
const fingerprint = (draft: RoleDraft) =>
  JSON.stringify({ ...draft, permissionIds: [...draft.permissionIds].sort() });
const normalizeSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

function isRole(value: unknown): value is RoleItem {
  if (!value || typeof value !== "object") return false;
  const role = value as Record<string, unknown>;
  return (
    typeof role.id === "string" &&
    typeof role.name === "string" &&
    (role.description === null || typeof role.description === "string") &&
    Array.isArray(role.permissions) &&
    role.permissions.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.code === "string",
    )
  );
}

function permissionGroup(code: string) {
  const prefixes: Array<[string, string]> = [
    ["ORDER_PAYMENT_", "Thanh toán · Đơn bán"],
    ["ACQUISITION_PAYMENT_", "Thanh toán · Phiếu nhập"],
    ["SERVICE_PAYMENT_", "Thanh toán · Dịch vụ"],
    ["SHIPMENT_PAYMENT_", "Thanh toán · Vận chuyển"],
    ["PAYMENT_", "Thanh toán · Toàn bộ"],
    ["WATCH_ACQUISITION_", "Phiếu nhập · Đồng hồ"],
    ["ACCESSORY_ACQUISITION_", "Phiếu nhập · Phụ kiện"],
    ["ACQUISITION_", "Phiếu nhập · Toàn bộ"],
    ["ACCESSORY_", "Phụ kiện"],
    ["PRODUCT_", "Sản phẩm"],
    ["ORDER_", "Đơn hàng"],
    ["PAYMENT_", "Thanh toán"],
    ["SHIPMENT_", "Vận chuyển"],
    ["SERVICE_", "Dịch vụ"],
    ["TASK_", "Công việc"],
    ["USER_", "Người dùng"],
    ["CUSTOMER_", "Khách hàng"],
    ["MEDIA_", "Media"],
    ["ACTIVITY_", "Hoạt động"],
    ["SYSTEM_", "Hệ thống"],
    ["DASHBOARD_", "Dashboard"],
  ];
  return prefixes.find(([prefix]) => code.startsWith(prefix))?.[1] ?? "Khác";
}

export default function RolePermissionManager({
  initialRoles,
  permissions,
}: {
  initialRoles: RoleItem[];
  permissions: PermissionItem[];
}) {
  const router = useRouter(),
    notify = useNotify(),
    dialog = useAppDialog();
  const first = initialRoles[0] ? fromRole(initialRoles[0]) : empty();
  const [roles, setRoles] = useState(initialRoles);
  const [draft, setDraft] = useState<RoleDraft>(first);
  const [saved, setSaved] = useState(() => fingerprint(first));
  const [query, setQuery] = useState("");
  const [showCodes, setShowCodes] = useState(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const savingRef = useRef(false),
    nameRef = useRef<HTMLInputElement>(null);
  const layout = useAdminSplitWorkspace<HTMLDivElement>();
  const pane = useAdminSplitResize(layout, "admin:roles:menu-width:v1");
  const navId = useId(),
    queryId = useId();
  const dirty = fingerprint(draft) !== saved;
  const selected = useMemo(
    () => new Set(draft.permissionIds),
    [draft.permissionIds],
  );
  const groups = useMemo(() => {
    const search = normalizeSearch(query.trim());
    return permissions.reduce<Record<string, PermissionItem[]>>(
      (result, permission) => {
        const group = permissionGroup(permission.code);
        if (
          search &&
          !normalizeSearch(
            `${group} ${permission.code} ${permission.description ?? ""}`,
          ).includes(search)
        )
          return result;
        (result[group] ||= []).push(permission);
        return result;
      },
      {},
    );
  }, [permissions, query]);
  const visibleCount = Object.values(groups).reduce(
    (count, items) => count + items.length,
    0,
  );
  const canLeave = useCallback(
    async () =>
      !savingRef.current &&
      (!dirty ||
        (await dialog.confirm({
          title: "Bỏ thay đổi chưa lưu?",
          message: "Các thay đổi về vai trò và quyền chưa được lưu.",
          confirmText: "Bỏ thay đổi",
          cancelText: "Tiếp tục sửa",
        }))),
    [dirty, dialog],
  );
  useEffect(() => {
    if (!dirty && !busy) return;
    const unload = (event: BeforeUnloadEvent) => event.preventDefault();
    const navigation = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (!link || link.target === "_blank" || link.hasAttribute("download"))
        return;
      const url = new URL(link.href, location.href);
      if (
        url.origin !== location.origin ||
        (url.pathname === location.pathname && url.search === location.search)
      )
        return;
      event.preventDefault();
      event.stopPropagation();
      void canLeave().then((leave) => {
        if (leave) router.push(url.pathname + url.search + url.hash);
      });
    };
    window.addEventListener("beforeunload", unload);
    document.addEventListener("click", navigation, true);
    return () => {
      window.removeEventListener("beforeunload", unload);
      document.removeEventListener("click", navigation, true);
    };
  }, [dirty, busy, canLeave, router]);
  async function choose(role?: RoleItem) {
    if (savingRef.current || (role?.id === draft.id && role)) return;
    if (!(await canLeave())) return;
    const next = role ? fromRole(role) : empty();
    setDraft(next);
    setSaved(fingerprint(next));
    setError("");
    if (!role) requestAnimationFrame(() => nameRef.current?.focus());
  }
  async function resetDraft() {
    if (!(await canLeave())) return;
    const original = roles.find((role) => role.id === draft.id);
    const next = original ? fromRole(original) : empty();
    setDraft(next);
    setSaved(fingerprint(next));
    setError("");
  }
  function toggle(id: string) {
    setDraft((current) => ({
      ...current,
      permissionIds: current.permissionIds.includes(id)
        ? current.permissionIds.filter((value) => value !== id)
        : [...current.permissionIds, id],
    }));
  }
  function toggleGroup(items: PermissionItem[]) {
    setDraft((current) => {
      const ids = new Set(current.permissionIds),
        all = items.every((item) => ids.has(item.id));
      items.forEach((item) => (all ? ids.delete(item.id) : ids.add(item.id)));
      return { ...current, permissionIds: Array.from(ids) };
    });
  }
  async function saveRole(event: React.FormEvent) {
    event.preventDefault();
    if (savingRef.current || !dirty) return;
    if (!draft.name.trim()) {
      setError("Tên vai trò không được để trống.");
      nameRef.current?.focus();
      return;
    }
    savingRef.current = true;
    setBusy(true);
    setError("");
    const input = { ...draft, permissionIds: [...draft.permissionIds] };
    try {
      const response = await fetch(
        input.id ? `/api/admin/roles/${input.id}` : "/api/admin/roles",
        {
          method: input.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        },
      );
      const data = await readUiResponse(
        response,
        "Không thể lưu vai trò. Vui lòng thử lại.",
      );
      if (!Array.isArray(data.roles) || !data.roles.every(isRole))
        throw new Error(
          "Không thể xác nhận kết quả lưu. Vui lòng tải lại để kiểm tra.",
        );
      const updated = data.roles as RoleItem[];
      const role = updated.find((role) =>
        input.id
          ? role.id === input.id
          : role.name === input.name.trim().replace(/\s+/g, "_").toUpperCase(),
      );
      if (!role)
        throw new Error(
          "Không thể xác nhận kết quả lưu. Vui lòng tải lại để kiểm tra.",
        );
      const next = fromRole(role);
      setRoles(updated);
      setDraft(next);
      setSaved(fingerprint(next));
      notify.success(input.id ? "Đã cập nhật vai trò." : "Đã tạo vai trò.");
      router.refresh();
    } catch (reason) {
      setError(
        uiFeedbackMessage(reason, "Không thể lưu vai trò. Vui lòng thử lại."),
      );
    } finally {
      savingRef.current = false;
      setBusy(false);
    }
  }
  return (
    <AdminManagementPage
      title="Vai trò & quyền truy cập"
      description="Chọn vai trò để quản lý phạm vi làm việc của người dùng."
      actions={
        <AdminLinkAction variant="quiet" href="/admin/users">
          <ArrowLeft size={16} aria-hidden="true" />
          Người dùng
        </AdminLinkAction>
      }
    >
      <div
        ref={layout}
        className={`${split.layout} ${resize.layout} ${styles.workspace}`}
        data-sidebar-collapsed={pane.width === 0}
        data-resizing={pane.resizing}
        style={{ ...ADMIN_SPLIT_WORKSPACE_STYLE, ...pane.style }}
      >
        <aside id={navId} data-admin-pane="sidebar">
          <div className={styles.desktopNav}>
            <AdminWorkspaceHeadingRow>
              <AdminWorkspaceHeading navigation>Vai trò</AdminWorkspaceHeading>
            </AdminWorkspaceHeadingRow>
            <nav aria-label="Danh sách vai trò" className={styles.roleList}>
              <AdminButton
                variant="quiet"
                className={styles.create}
                disabled={busy}
                aria-pressed={!draft.id}
                onClick={() => void choose()}
              >
                <Plus size={16} aria-hidden="true" />
                Tạo vai trò
              </AdminButton>
              {roles.map((role) => (
                <AdminButton
                  variant="contextual"
                  className={styles.role}
                  key={role.id}
                  disabled={busy}
                  onClick={() => void choose(role)}
                  aria-pressed={draft.id === role.id}
                >
                  <span className={styles.roleName} title={role.name}>
                    {role.name}
                  </span>
                  <span className={shared.metadata}>
                    {role.permissions.length} quyền
                  </span>
                </AdminButton>
              ))}
            </nav>
            <p className={`${shared.metadata} ${styles.help}`}>
              Người dùng có thể có nhiều vai trò. Quyền hiệu lực được tổng hợp
              từ các vai trò đã gán.
            </p>
          </div>
          <div className={styles.mobileNav}>
            <label className={shared.field}>
              Vai trò
              <select
                className={shared.input}
                disabled={busy}
                value={draft.id || "__new__"}
                onChange={(event) =>
                  void choose(
                    roles.find((role) => role.id === event.target.value),
                  )
                }
              >
                <option value="__new__">Tạo vai trò mới</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name} · {role.permissions.length} quyền
                  </option>
                ))}
              </select>
            </label>
          </div>
        </aside>
        <div
          {...pane.separatorProps}
          aria-label="Điều chỉnh độ rộng danh sách vai trò"
          aria-controls={navId}
          className={resize.separator}
        />
        <section data-admin-pane="content" className={styles.editor}>
          <form
            onSubmit={saveRole}
            data-admin-form
            aria-label="Chỉnh sửa vai trò"
            className={shared.form}
          >
            <AdminWorkspaceHeadingRow>
              <AdminWorkspaceHeading>
                {draft.id ? "Thông tin vai trò" : "Vai trò mới"}
              </AdminWorkspaceHeading>
              <div className={styles.actions}>
                <PageEditingState dirty={dirty} saving={busy} />
                {dirty && (
                  <AdminManagementButton
                    disabled={busy}
                    onClick={() => void resetDraft()}
                  >
                    Hủy thay đổi
                  </AdminManagementButton>
                )}
                <AdminManagementButton
                  primary
                  type="submit"
                  pending={busy}
                  pendingLabel="Đang lưu…"
                  disabled={!dirty || busy}
                >
                  <Save size={16} aria-hidden="true" />
                  Lưu vai trò
                </AdminManagementButton>
              </div>
            </AdminWorkspaceHeadingRow>
            {error && <PageNotice title={error} />}
            <fieldset disabled={busy} className={styles.fields}>
              <label className={shared.field}>
                Tên vai trò
                <input
                  ref={nameRef}
                  className={shared.input}
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  disabled={draft.name === "ADMIN"}
                  placeholder="VD: QUAN_LY_KHO"
                  required
                />
              </label>
              <AdminManagementField
                label="Mô tả"
                value={draft.description}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Phạm vi trách nhiệm của vai trò"
              />
            </fieldset>
          </form>
          <AdminManagementSection
            title="Quyền truy cập"
            description={`Đã chọn ${selected.size}/${permissions.length} quyền`}
          >
            <div className={styles.toolbar}>
              <label className={styles.search} htmlFor={queryId}>
                <Search size={16} aria-hidden="true" />
                <input
                  id={queryId}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Tìm quyền hoặc nhóm quyền…"
                  aria-label="Tìm quyền hoặc nhóm quyền"
                />
                {query && (
                  <AdminButton
                    variant="contextual"
                    type="button"
                    aria-label="Xóa tìm quyền"
                    onClick={() => setQuery("")}
                  >
                    <X size={16} aria-hidden="true" />
                  </AdminButton>
                )}
              </label>
              <label className={styles.showCodes}>
                <input
                  type="checkbox"
                  checked={showCodes}
                  onChange={(event) => setShowCodes(event.target.checked)}
                />
                Hiện mã quyền
              </label>
            </div>
            {query && (
              <p className={shared.metadata}>
                {visibleCount} quyền khớp tìm kiếm · Chọn nhóm chỉ áp dụng cho
                kết quả đang hiển thị.
              </p>
            )}
            <fieldset disabled={busy} className={styles.permissions}>
              {Object.entries(groups).map(([group, items]) => {
                const count = items.filter((item) =>
                  selected.has(item.id),
                ).length;
                return (
                  <section
                    key={group}
                    aria-label={group}
                    className={styles.group}
                  >
                    <div className={styles.groupHeading}>
                      <h3 className={shared.sectionTitle}>
                        {group}
                        <span className={shared.metadata}>
                          {" "}
                          {count}/{items.length} đã chọn
                        </span>
                      </h3>
                      <AdminButton
                        variant="quiet"
                        density="compact"
                        type="button"
                        onClick={() => toggleGroup(items)}
                      >
                        {count === items.length
                          ? query
                            ? "Bỏ chọn kết quả"
                            : "Bỏ chọn nhóm"
                          : query
                            ? "Chọn kết quả"
                            : "Chọn cả nhóm"}
                      </AdminButton>
                    </div>
                    <div className={styles.permissionList}>
                      {items.map((permission) => (
                        <label
                          key={permission.id}
                          className={`${shared.checkRow} ${styles.permission}`}
                        >
                          <input
                            type="checkbox"
                            checked={selected.has(permission.id)}
                            onChange={() => toggle(permission.id)}
                          />
                          <span>
                            <span className={styles.permissionName}>
                              {permission.description?.trim() ||
                                permission.code}
                            </span>
                            {showCodes && permission.description?.trim() && (
                              <span className={shared.metadata}>
                                {permission.code}
                              </span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </section>
                );
              })}
              {!visibleCount && (
                <div className={styles.empty}>
                  <p>
                    {query
                      ? "Không tìm thấy quyền phù hợp."
                      : "Chưa có quyền trong danh mục."}
                  </p>
                  <AdminButton
                    variant="quiet"
                    type="button"
                    onClick={() => setQuery("")}
                  >
                    Xóa tìm kiếm
                  </AdminButton>
                </div>
              )}
            </fieldset>
          </AdminManagementSection>
        </section>
      </div>
    </AdminManagementPage>
  );
}
