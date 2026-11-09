import type { DB } from '@/server/db/client';
import { businessDay } from '../business-day';
import { lookupAllowed, type AssistantAuthority } from '../capabilities';
import { AssistantError } from './access';

export type DailyBusinessTool = 'orders.list' | 'technicalIssues.list';
const limit = 12;

// Same global view scope as the admin Order list and Technical Issue board.
// Deliberately omit customer identities, contact/address, amounts and free notes.
export async function dailyBusiness(
  db: DB,
  actor: AssistantAuthority,
  tool: DailyBusinessTool,
  date: string | null,
  now = new Date()
) {
  if (!lookupAllowed(actor, tool))
    throw new AssistantError('Không có quyền xem danh sách này.', 403);
  const day = businessDay(date, now);
  const range = { gte: day.start, lt: day.end };
  const base = {
    date: day.date,
    timeZone: day.timeZone,
    observedAt: now.toISOString(),
    limit,
  };
  if (tool === 'orders.list') {
    const where = { createdAt: range };
    const [total, rows] = await Promise.all([
      db.order.count({ where }),
      db.order.findMany({
        where,
        take: limit,
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
        select: {
          id: true,
          refNo: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
        },
      }),
    ]);
    return {
      ...base,
      dateField: 'createdAt',
      meaning:
        'Đơn hàng được tạo trong ngày; không phải toàn bộ đơn đang xử lý hoặc giao trong ngày.',
      total,
      truncated: total > rows.length,
      items: rows.map((row) => ({
        id: row.id,
        reference: row.refNo,
        status: row.status,
        paymentStatus: row.paymentStatus,
        createdAt: row.createdAt.toISOString(),
        href: '/admin/orders/' + encodeURIComponent(row.id),
      })),
    };
  }
  const where = { openedAt: range };
  const [total, rows] = await Promise.all([
    db.technicalIssue.count({ where }),
    db.technicalIssue.findMany({
      where,
      take: limit,
      orderBy: [{ openedAt: 'desc' }, { id: 'asc' }],
      select: {
        id: true,
        summary: true,
        executionStatus: true,
        openedAt: true,
        expectedCompletionAt: true,
        serviceRequestId: true,
        serviceRequest: { select: { refNo: true } },
      },
    }),
  ]);
  return {
    ...base,
    dateField: 'openedAt',
    meaning:
      'Phiếu kỹ thuật được mở trong ngày; không phải toàn bộ phiếu tồn đọng hoặc đến hạn hôm nay.',
    total,
    truncated: total > rows.length,
    items: rows.map((row) => ({
      id: row.id,
      reference: row.serviceRequest.refNo,
      title: row.summary?.slice(0, 180) ?? 'Phiếu kỹ thuật',
      status: row.executionStatus,
      openedAt: row.openedAt.toISOString(),
      expectedCompletionAt: row.expectedCompletionAt?.toISOString() ?? null,
      href:
        '/admin/services/issues-board?serviceRequestId=' +
        encodeURIComponent(row.serviceRequestId),
    })),
  };
}
