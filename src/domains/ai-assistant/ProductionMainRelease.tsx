'use client';

import { useState } from 'react';

export default function ProductionMainRelease() {
  const [sha, setSha] = useState<string>();
  const [workflowUrl, setWorkflowUrl] = useState<string>();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(release: boolean) {
    setBusy(true);
    setError(undefined);
    try {
      const response = await fetch('/api/admin/ben-code', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(
          release
            ? { action: 'deploy-production-main', sha }
            : { action: 'production-main-preview' },
        ),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (release) setWorkflowUrl(data.workflowUrl);
      else setSha(data.sha);
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : 'Hãy kiểm tra lại trên GitHub.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-4 rounded-xl border border-red-200 p-4 text-sm">
      <button type="button" disabled={busy} onClick={() => void submit(false)}>
        Xem commit production trên main
      </button>
      {sha && (
        <>
          <p className="my-2 break-all">
            Commit cần duyệt <code>{sha}</code>
          </p>
          <p className="my-2">
            Sau khi xác nhận, GitHub Actions sẽ yêu cầu bạn duyệt môi trường
            production.
          </p>
          <button
            className="rounded border border-red-300 px-3 py-2"
            type="button"
            disabled={busy || !!workflowUrl}
            onClick={() => void submit(true)}
          >
            Deploy production
          </button>
        </>
      )}
      {error && <p role="alert">{error}</p>}
      {workflowUrl && (
        <a
          className="block underline"
          href={workflowUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Mở GitHub Actions để duyệt
        </a>
      )}
    </section>
  );
}
