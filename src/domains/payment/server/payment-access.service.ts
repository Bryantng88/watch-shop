import type { Prisma } from "@prisma/client";

import { PERMISSIONS } from "@/constants/permissions";
import { getCurrentUserPermissions } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";

export type PaymentBusinessScope = "ORDER" | "ACQUISITION" | "SERVICE" | "SHIPMENT" | "ALL";
export type PaymentAction = "VIEW" | "CREATE" | "UPDATE" | "DELETE";

const PERMISSION_BY_SCOPE: Record<PaymentBusinessScope, Record<PaymentAction, string>> = {
  ORDER: { VIEW: PERMISSIONS.ORDER_PAYMENT_VIEW, CREATE: PERMISSIONS.ORDER_PAYMENT_CREATE, UPDATE: PERMISSIONS.ORDER_PAYMENT_UPDATE, DELETE: PERMISSIONS.ORDER_PAYMENT_DELETE },
  ACQUISITION: { VIEW: PERMISSIONS.ACQUISITION_PAYMENT_VIEW, CREATE: PERMISSIONS.ACQUISITION_PAYMENT_CREATE, UPDATE: PERMISSIONS.ACQUISITION_PAYMENT_UPDATE, DELETE: PERMISSIONS.ACQUISITION_PAYMENT_DELETE },
  SERVICE: { VIEW: PERMISSIONS.SERVICE_PAYMENT_VIEW, CREATE: PERMISSIONS.SERVICE_PAYMENT_CREATE, UPDATE: PERMISSIONS.SERVICE_PAYMENT_UPDATE, DELETE: PERMISSIONS.SERVICE_PAYMENT_DELETE },
  SHIPMENT: { VIEW: PERMISSIONS.SHIPMENT_PAYMENT_VIEW, CREATE: PERMISSIONS.SHIPMENT_PAYMENT_CREATE, UPDATE: PERMISSIONS.SHIPMENT_PAYMENT_UPDATE, DELETE: PERMISSIONS.SHIPMENT_PAYMENT_DELETE },
  ALL: { VIEW: PERMISSIONS.PAYMENT_VIEW_ALL, CREATE: PERMISSIONS.PAYMENT_CREATE_ALL, UPDATE: PERMISSIONS.PAYMENT_UPDATE_ALL, DELETE: PERMISSIONS.PAYMENT_DELETE_ALL },
};

export function normalizePaymentBusinessScope(ownerType: unknown): PaymentBusinessScope {
  const value = String(ownerType ?? "").toUpperCase();
  if (value === "ORDER" || value === "ACQUISITION" || value === "SHIPMENT") return value;
  if (value === "SERVICE" || value === "TECHNICAL_ISSUE") return "SERVICE";
  return "ALL";
}

export function canAccessPaymentBusiness(permissions: readonly string[], action: PaymentAction, scope: PaymentBusinessScope) {
  return permissions.includes(PERMISSION_BY_SCOPE.ALL[action]) || permissions.includes(PERMISSION_BY_SCOPE[scope][action]);
}

export function resolvePaymentBusinessScopes(permissions: readonly string[], action: PaymentAction = "VIEW"): PaymentBusinessScope[] {
  if (permissions.includes(PERMISSION_BY_SCOPE.ALL[action])) return ["ALL"];
  return (["ORDER", "ACQUISITION", "SERVICE", "SHIPMENT"] as const)
    .filter((scope) => permissions.includes(PERMISSION_BY_SCOPE[scope][action]));
}

export function paymentBusinessWhere(scopes: readonly PaymentBusinessScope[]): Prisma.PaymentWhereInput {
  if (scopes.includes("ALL")) return {};
  const clauses: Prisma.PaymentWhereInput[] = [];
  if (scopes.includes("ORDER")) clauses.push({ order_id: { not: null }, acquisition_id: null, service_request_id: null, technical_issue_id: null, shipment_id: null });
  if (scopes.includes("ACQUISITION")) clauses.push({ acquisition_id: { not: null }, order_id: null, service_request_id: null, technical_issue_id: null, shipment_id: null });
  if (scopes.includes("SERVICE")) clauses.push({ OR: [{ service_request_id: { not: null } }, { technical_issue_id: { not: null } }], order_id: null, acquisition_id: null, shipment_id: null });
  if (scopes.includes("SHIPMENT")) clauses.push({ shipment_id: { not: null }, acquisition_id: null, service_request_id: null, technical_issue_id: null });
  return clauses.length ? { OR: clauses } : { id: "__no_authorized_payment__" };
}

export async function authorizePaymentOwner(ownerType: unknown, action: PaymentAction) {
  const { user, permissions } = await getCurrentUserPermissions();
  if (!user) return { ok: false as const, status: 401 as const };
  const scope = normalizePaymentBusinessScope(ownerType);
  return canAccessPaymentBusiness(permissions, action, scope)
    ? { ok: true as const, user, permissions, scope }
    : { ok: false as const, status: 403 as const };
}

export async function authorizePaymentAccess(paymentId: string, action: PaymentAction) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: { order_id: true, acquisition_id: true, service_request_id: true, technical_issue_id: true, shipment_id: true },
  });
  if (!payment) return { ok: false as const, status: 404 as const };
  const serviceOwned = Boolean(payment.service_request_id || payment.technical_issue_id);
  const conflicting = Boolean(
    payment.acquisition_id && (payment.order_id || payment.shipment_id || serviceOwned)
      || serviceOwned && (payment.order_id || payment.shipment_id),
  );
  if (conflicting) return authorizePaymentOwner("ALL", action);
  if (payment.shipment_id) return authorizePaymentOwner("SHIPMENT", action);
  if (payment.order_id) return authorizePaymentOwner("ORDER", action);
  if (payment.acquisition_id) return authorizePaymentOwner("ACQUISITION", action);
  if (serviceOwned) return authorizePaymentOwner("SERVICE", action);
  return authorizePaymentOwner("ALL", action);
}
