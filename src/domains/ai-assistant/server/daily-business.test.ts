import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { DB } from '@/server/db/client';
import { businessDay, businessDateSchema } from '../business-day';
import { benEnvironment, benEnvironmentLabel } from '../environment';
import { assistantLookupSchema } from '../live-contract';
import { readableMessages } from './conversation-state';
import { newConversation } from '../simulation';
import { dailyBusiness } from './daily-business';

const now = new Date('2026-11-08T17:00:00Z');
const actor = (...permissions: string[]) => ({
  admin: false,
  permissions: new Set(permissions),
});

test('business dates respect Vietnam midnight, leap days and a half-open UTC interval', () => {
  const day = businessDay(null, now);
  assert.equal(day.date, '2026-11-09');
  assert.equal(day.start.toISOString(), '2026-11-08T17:00:00.000Z');
  assert.equal(day.end.toISOString(), '2026-11-09T17:00:00.000Z');
  assert.equal(
    businessDay(null, new Date(now.getTime() - 1)).date,
    '2026-11-08'
  );
  assert.equal(businessDay('2024-02-29', now).date, '2024-02-29');
  for (const value of [
    '2026-02-29',
    '2026-02-30',
    '2026-13-01',
    '09/11/2026',
    'today',
    '2026-11-09T00:00:00Z',
  ])
    assert.equal(businessDateSchema.safeParse(value).success, false);
});

test('list contracts accept only an optional calendar date, never arbitrary filters or another user', () => {
  for (const tool of ['orders.list', 'technicalIssues.list']) {
    assert.deepEqual(assistantLookupSchema.parse({ tool }), {
      tool,
      query: null,
    });
    assert.equal(
      assistantLookupSchema.safeParse({ tool, query: '2026-11-09' }).success,
      true
    );
    assert.equal(
      assistantLookupSchema.safeParse({ tool, query: '2026-02-30' }).success,
      false
    );
    assert.equal(
      assistantLookupSchema.safeParse({ tool, query: null, userId: 'other' })
        .success,
      false
    );
  }
});

test('order listing is bounded, separates total from shown rows and never selects customer or financial data', async () => {
  const calls: unknown[] = [];
  const rows = [
    {
      id: 'o/1',
      refNo: 'OD-1',
      status: 'DRAFT',
      paymentStatus: 'UNPAID',
      createdAt: now,
    },
  ];
  const db = {
    order: {
      count: async (args: unknown) => {
        calls.push(args);
        return 13;
      },
      findMany: async (args: unknown) => {
        calls.push(args);
        return rows;
      },
    },
  } as unknown as DB;
  const result = await dailyBusiness(
    db,
    actor('ORDER_VIEW'),
    'orders.list',
    null,
    now
  );
  assert.equal(result.date, '2026-11-09');
  assert.equal(result.total, 13);
  assert.equal(result.items.length, 1);
  assert.equal(result.truncated, true);
  assert.equal(result.dateField, 'createdAt');
  assert.equal(result.items[0].href, '/admin/orders/o%2F1');
  const args = calls[1] as { take: number; where: object; select: object };
  assert.equal(args.take, 12);
  assert.deepEqual(args.where, {
    createdAt: { gte: now, lt: new Date('2026-11-09T17:00:00Z') },
  });
  assert.deepEqual(Object.keys(args.select).sort(), [
    'createdAt',
    'id',
    'paymentStatus',
    'refNo',
    'status',
  ]);
  const emptyDb = {
    order: { count: async () => 0, findMany: async () => [] },
  } as unknown as DB;
  const empty = await dailyBusiness(
    emptyDb,
    actor('ORDER_VIEW'),
    'orders.list',
    '2026-11-08',
    now
  );
  assert.equal(empty.truncated, false);
  assert.equal(empty.total, 0);
  assert.deepEqual(empty.items, []);
});

test('technical issue listing uses openedAt and SERVICE_VIEW independently of personal tasks or product permissions', async () => {
  let selected: unknown;
  const db = {
    technicalIssue: {
      count: async () => 1,
      findMany: async (args: unknown) => {
        selected = args;
        return [
          {
            id: 'issue',
            summary: 'Kiểm tra máy',
            executionStatus: 'OPEN',
            openedAt: now,
            expectedCompletionAt: null,
            serviceRequestId: 'sr',
            serviceRequest: { refNo: 'SR-1' },
          },
        ];
      },
    },
  } as unknown as DB;
  const result = await dailyBusiness(
    db,
    actor('SERVICE_VIEW'),
    'technicalIssues.list',
    null,
    now
  );
  assert.equal(result.total, 1);
  assert.equal(result.dateField, 'openedAt');
  assert.equal(
    result.items[0].href,
    '/admin/services/issues-board?serviceRequestId=sr'
  );
  assert.deepEqual((selected as { where: object }).where, {
    openedAt: { gte: now, lt: new Date('2026-11-09T17:00:00Z') },
  });
  for (const field of [
    'note',
    'resolutionNote',
    'actualCost',
    'estimatedCost',
    'customer',
  ])
    assert.equal(field in (selected as { select: object }).select, false);
});

test('authorization fails before any database read and revoked history is redacted', async () => {
  const db = new Proxy(
    {},
    {
      get() {
        throw Error('Database must not be read');
      },
    }
  ) as DB;
  for (const tool of ['orders.list', 'technicalIssues.list'] as const)
    await assert.rejects(
      dailyBusiness(db, actor('TASK_VIEW'), tool, null, now),
      /Không có quyền/
    );
  const state = newConversation(null);
  state.messages = [
    {
      id: 'a',
      role: 'assistant',
      text: 'private order',
      requiredPermissions: ['ORDER_VIEW'],
    },
    {
      id: 'b',
      role: 'assistant',
      text: 'private issue',
      requiredPermissions: ['SERVICE_VIEW'],
    },
  ];
  const history = readableMessages(state, actor('TASK_VIEW'));
  assert.equal(JSON.stringify(history).includes('private'), false);
  assert.equal(
    readableMessages(state, actor('ORDER_VIEW'))[0].text,
    'private order'
  );
});

test('production does not claim staging; unknown environment stays unlabelled and simulations stay labelled', () => {
  assert.equal(
    benEnvironmentLabel(
      true,
      benEnvironment({
        BEN_CUSTOMER_ENVIRONMENT: 'production',
        PERSONAL_CODEX_ENVIRONMENT: 'staging',
      })
    ),
    null
  );
  assert.equal(
    benEnvironmentLabel(
      true,
      benEnvironment({ PERSONAL_CODEX_ENVIRONMENT: 'staging' })
    ),
    'STAGING'
  );
  assert.equal(benEnvironmentLabel(true), null);
  assert.equal(benEnvironmentLabel(false, 'production'), 'GIẢ LẬP');
  assert.equal(benEnvironmentLabel(false, undefined, 'MẪU'), 'MẪU');
});
