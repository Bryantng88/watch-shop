'use client';
import type { CodeDraft, CodeJob } from './code-contract';
const labels: Record<string, string> = {
  QUEUED: 'Đang chờ worker',
  RUNNING: 'Đang sửa code và kiểm tra',
  PR_OPEN: 'Đã mở draft PR',
  FAILED: 'Lượt sửa chưa hoàn tất',
  CANCELLED: 'Đã dừng',
  MERGE_QUEUED: 'Đang chờ merge',
  MERGING: 'Đang merge',
  MERGED: 'Đã merge',
  DEPLOY_QUEUED: 'Đang chờ runner staging',
  DEPLOYING: 'Đang triển khai staging',
  DEPLOYED: 'Đã xác nhận staging',
  DEPLOY_FAILED: 'Chưa triển khai staging',
  RECONCILE_REQUIRED: 'Cần đối chiếu GitHub/NAS trước khi tiếp tục',
};
export default function CodeJobPanel({
  draft,
  job,
  busy,
  canRun,
  canMerge,
  canDeploy,
  canDeployProduction,
  onCommand,
}: {
  draft?: CodeDraft;
  job?: CodeJob;
  busy: boolean;
  canRun: boolean;
  canMerge: boolean;
  canDeploy: boolean;
  canDeployProduction: boolean;
  onCommand: (
    action: 'approve' | 'cancel' | 'merge' | 'deploy' | 'deploy-production',
    input: { revision?: number; jobId?: string; sha?: string },
  ) => void;
}) {
  return (
    <>
      {draft && (
        <section className="mt-4 rounded-xl border border-blue-200 bg-white p-4">
          <h3 className="font-semibold">Sửa code · {draft.title}</h3>
          <p className="my-3 whitespace-pre-wrap text-sm">{draft.request}</p>
          <p className="text-xs text-slate-500">
            {draft.baseRef} @ {draft.baseSha.slice(0, 8)} → PR vào{' '}
            {draft.prBase}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Worker chạy trong checkout riêng; chưa merge hoặc deploy.
          </p>
          <button
            type="button"
            disabled={busy || !canRun}
            onClick={() => onCommand('approve', { revision: draft.revision })}
            className="mt-3 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            Bắt đầu sửa và mở PR
          </button>
        </section>
      )}
      {job && (
        <section
          aria-label="Tiến độ sửa code"
          className="mt-4 rounded-xl border border-blue-100 bg-white p-4"
        >
          <h3 className="font-semibold">{job.title}</h3>
          <p role="status" className="mt-2 text-sm text-blue-700">
            {labels[job.status] || job.status}
          </p>
          {job.errorCode && (
            <p className="mt-1 text-xs text-slate-500">{job.errorCode}</p>
          )}
          <p className="mt-2 break-all text-xs text-slate-500">
            {job.branch} · Nền {job.baseSha.slice(0, 8)}
          </p>
          {job.checks && (
            <ul className="mt-2 text-xs text-slate-600">
              {job.checks.map((c) => (
                <li key={c.name}>
                  {c.name}:{' '}
                  {c.status === 'PASSED'
                    ? 'Đạt'
                    : c.status === 'SKIPPED'
                      ? 'Không có kiểm tra tương ứng'
                      : 'Không đạt'}
                </li>
              ))}
            </ul>
          )}
          {job.resultUrl && (
            <a
              href={job.resultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-sm text-blue-700 underline"
            >
              Mở PR #{job.prNumber} · {job.headSha?.slice(0, 8)}
            </a>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {['QUEUED', 'RUNNING', 'MERGE_QUEUED', 'DEPLOY_QUEUED'].includes(
              job.status,
            ) && (
              <button
                type="button"
                disabled={busy}
                onClick={() => onCommand('cancel', { jobId: job.id })}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                Dừng lượt chạy
              </button>
            )}
            {job.status === 'PR_OPEN' && (
              <button
                type="button"
                disabled={busy || !canMerge}
                onClick={() =>
                  onCommand('merge', { jobId: job.id, sha: job.headSha })
                }
                className="rounded-lg border border-blue-200 px-3 py-2 text-sm text-blue-700 disabled:opacity-40"
              >
                Merge PR #{job.prNumber} @ {job.headSha?.slice(0, 8)}
              </button>
            )}
            {['PR_OPEN', 'MERGED', 'DEPLOY_FAILED'].includes(job.status) && (
              <button
                type="button"
                disabled={busy || !canDeploy}
                onClick={() =>
                  onCommand('deploy', {
                    jobId: job.id,
                    sha: job.mergedSha || job.headSha,
                  })
                }
                className="rounded-lg border border-blue-200 px-3 py-2 text-sm text-blue-700 disabled:opacity-40"
              >
                Deploy staging @ {(job.mergedSha || job.headSha)?.slice(0, 8)}
              </button>
            )}
            {canDeployProduction &&
              job.mergedSha &&
              ['MERGED', 'DEPLOYED'].includes(job.status) && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Tạo tag production cho commit ${job.mergedSha}? GitHub sẽ yêu cầu phê duyệt môi trường production.`,
                      )
                    )
                      onCommand('deploy-production', {
                        jobId: job.id,
                        sha: job.mergedSha,
                      });
                  }}
                  className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700"
                >
                  Deploy production @ {job.mergedSha.slice(0, 8)}
                </button>
              )}
          </div>
          {job.status === 'PR_OPEN' && !canMerge && (
            <p className="mt-2 text-xs text-slate-500">Merge chưa được bật.</p>
          )}
          {['PR_OPEN', 'MERGED'].includes(job.status) && !canDeploy && (
            <p className="mt-1 text-xs text-slate-500">
              Runner staging chưa được cấu hình.
            </p>
          )}
        </section>
      )}
    </>
  );
}
