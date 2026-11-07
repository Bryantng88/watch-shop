import { AssistantError, assistantActor } from './access';
import { prisma } from '@/server/db/client';
import { checksPassed, gitSha, type CodeJob } from '../code-contract';
import { canRequestProduction } from '../production-release';

const repository = 'Bryantng88/watch-shop';

export async function requestProductionRelease(
  userId: string,
  conversationId: string,
  jobId: string,
  sha: string,
) {
  async function authorize() {
    const actor = await assistantActor(prisma, userId);
    if (!canRequestProduction(actor))
      throw new AssistantError(
        'Chỉ Long có ADMIN được phát hành production khi tính năng đã bật.',
        403,
      );
    const row = await prisma.customerAssistantConversation.findFirst({
      where: { id: conversationId, ownerId: userId },
      select: { state: true },
    });
    const job = (row?.state as { codeJob?: CodeJob } | undefined)?.codeJob;
    if (
      !job ||
      job.id !== jobId ||
      job.prBase !== 'main' ||
      job.mergedSha !== sha ||
      !gitSha.safeParse(sha).success ||
      !['MERGED', 'DEPLOYED'].includes(job.status) ||
      !checksPassed(job.checks || [])
    )
      throw new AssistantError(
        'Cần lượt sửa đã merge vào main và đúng SHA được duyệt.',
        409,
      );
  }

  return publishProductionTag(sha, authorize);
}

export async function publishProductionTag(
  sha: string,
  authorize: () => Promise<void>,
  fetchGitHub: typeof fetch = fetch,
) {
  await authorize();
  const token = process.env.BEN_PRODUCTION_GITHUB_TOKEN!;
  async function github(path: string, body?: object) {
    return fetchGitHub(`https://api.github.com/repos/${repository}/${path}`, {
      method: body ? 'POST' : 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'Watch-Shop-Ben-Production',
      },
      body: body ? JSON.stringify(body) : undefined,
      redirect: 'error',
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
  }
  async function read(path: string) {
    const response = await github(path);
    if (!response.ok)
      throw new AssistantError('GitHub chưa xác nhận được bản phát hành.', 502);
    return response.json();
  }
  const commit = await read('commits/main');
  if (commit.sha !== sha)
    throw new AssistantError(
      'Main đã đổi. Hãy kiểm tra lại commit phát hành.',
      409,
    );
  const date = commit.commit?.committer?.date
    ?.slice(0, 10)
    ?.replaceAll('-', '');
  if (typeof date !== 'string' || !/^\d{8}$/.test(date))
    throw new AssistantError('Không xác nhận được ngày commit.', 502);
  const tag = `production-${date}-ben-${sha}`;
  const workflowUrl = `https://github.com/${repository}/actions/workflows/deploy-production.yml?query=branch%3A${tag}`;
  async function existingTag() {
    const response = await github(`git/ref/tags/${tag}`);
    if (response.status === 404) return false;
    if (!response.ok)
      throw new AssistantError('Không kiểm tra được tag production.', 502);
    const ref = await response.json();
    if (ref.object?.type !== 'tag' || !gitSha.safeParse(ref.object.sha).success)
      throw new AssistantError('Tag production hiện có cần đối chiếu.', 409);
    const object = await read(`git/tags/${ref.object.sha}`);
    if (object.object?.type !== 'commit' || object.object.sha !== sha)
      throw new AssistantError('Tag production hiện có trỏ sai commit.', 409);
    return true;
  }
  if (await existingTag()) return { tag, workflowUrl };
  const checks = await read(
    `commits/${sha}/check-runs?per_page=100&filter=latest`,
  );
  const required = process.env
    .BEN_PRODUCTION_REQUIRED_CHECKS!.split(',')
    .map((value) => value.trim());
  if (
    !Array.isArray(checks.check_runs) ||
    checks.total_count > 100 ||
    !required.every((name) => {
      const matches = checks.check_runs.filter(
        (check: { name: string; app?: { slug: string } }) =>
          check.name === name && check.app?.slug === 'github-actions',
      );
      return (
        matches.length === 1 &&
        matches[0].status === 'completed' &&
        matches[0].conclusion === 'success'
      );
    })
  )
    throw new AssistantError(
      'Các kiểm tra bắt buộc cho SHA này chưa đạt.',
      409,
    );

  const annotation = await github('git/tags', {
    tag,
    message: `Ben production release for approved commit ${sha}`,
    object: sha,
    type: 'commit',
  });
  if (!annotation.ok)
    throw new AssistantError('GitHub từ chối tạo tag object.', 502);
  const object = await annotation.json();
  if (!gitSha.safeParse(object.sha).success)
    throw new AssistantError('GitHub trả về tag object không hợp lệ.', 502);
  if ((await read('commits/main')).sha !== sha)
    throw new AssistantError(
      'Main đã đổi. Hãy kiểm tra lại commit phát hành.',
      409,
    );
  await authorize();
  const created = await github('git/refs', {
    ref: `refs/tags/${tag}`,
    sha: object.sha,
  });
  if (!created.ok && !(await existingTag()))
    throw new AssistantError(
      'Chưa xác nhận được tag. Kiểm tra GitHub trước khi thử lại.',
      502,
    );
  return { tag, workflowUrl };
}
