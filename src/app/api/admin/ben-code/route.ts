import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUserPermissions } from '@/server/auth/requirePermission';
import { AssistantError } from '@/domains/ai-assistant/server/access';
import { codeCommand } from '@/domains/ai-assistant/server/code-jobs';
import { requestProductionRelease } from '@/domains/ai-assistant/server/production-release';
const command = z.discriminatedUnion('action', [
  z
    .object({
      action: z.literal('approve'),
      id: z.string().uuid(),
      revision: z.number().int().positive(),
    })
    .strict(),
  z
    .object({
      action: z.literal('cancel'),
      id: z.string().uuid(),
      jobId: z.string().uuid(),
    })
    .strict(),
  z
    .object({
      action: z.enum(['merge', 'deploy', 'deploy-production']),
      id: z.string().uuid(),
      jobId: z.string().uuid(),
      sha: z.string().regex(/^[a-f0-9]{40}$/),
    })
    .strict(),
]);
export async function POST(req: NextRequest) {
  try {
    const { user } = await getCurrentUserPermissions();
    if (!user)
      return NextResponse.json({ error: 'Cần đăng nhập.' }, { status: 401 });
    if (
      !process.env.APP_URL ||
      req.headers.get('origin') !== new URL(process.env.APP_URL).origin
    )
      throw new AssistantError('Origin không hợp lệ.', 403);
    const raw = await req.text();
    if (raw.length > 2000) throw new AssistantError('Yêu cầu quá dài.');
    const c = command.parse(JSON.parse(raw));
    if (c.action === 'deploy-production')
      return NextResponse.json(
        await requestProductionRelease(user.id, c.id, c.jobId, c.sha),
      );
    return NextResponse.json(await codeCommand(user.id, c.id, c.action, c));
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof AssistantError
            ? e.message
            : 'Chưa xác nhận được thao tác; tải lại để đối chiếu.',
      },
      { status: e instanceof AssistantError ? e.status : 400 },
    );
  }
}
