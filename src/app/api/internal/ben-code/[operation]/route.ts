import { NextRequest, NextResponse } from 'next/server';
import {
  codeTokenMatches,
  codeWorker,
} from '@/domains/ai-assistant/server/code-jobs';
import {
  customerAssistantReady,
  AssistantError,
} from '@/domains/ai-assistant/server/access';
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ operation: string }> }
) {
  if (!customerAssistantReady())
    return NextResponse.json({ error: 'Unavailable' }, { status: 503 });
  const { operation } = await ctx.params,
    release = operation.startsWith('release-'),
    op = release ? operation.slice(8) : operation;
  if (!['claim', 'heartbeat', 'finish'].includes(op))
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (
    !codeTokenMatches(
      req.headers.get('authorization')?.replace(/^Bearer /, '') || null,
      release
    )
  )
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const raw = await req.text();
    if (raw.length > 12000) throw new AssistantError('Too large', 413);
    return NextResponse.json(await codeWorker(op, JSON.parse(raw), release));
  } catch (e) {
    return NextResponse.json(
      { error: 'Request rejected' },
      { status: e instanceof AssistantError ? e.status : 400 }
    );
  }
}
