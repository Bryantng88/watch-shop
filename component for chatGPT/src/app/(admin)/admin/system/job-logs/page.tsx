"use client";

import { useEffect, useState } from "react";

export default function JobLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);

    async function load() {
        const res = await fetch("/api/admin/system-job-logs");
        const data = await res.json();
        setLogs(data.logs || []);
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>Job Logs</h2>

            <table border={1} cellPadding={6}>
                <thead>
                    <tr>
                        <th>Processor</th>
                        <th>Status</th>
                        <th>Processed</th>
                        <th>Error</th>
                        <th>Started</th>
                        <th>Finished</th>
                    </tr>
                </thead>

                <tbody>
                    {logs.map((l) => (
                        <tr key={l.id}>
                            <td>{l.processorKey}</td>
                            <td>{l.status}</td>
                            <td>{l.processedCount}</td>
                            <td>{l.errorCount}</td>
                            <td>{new Date(l.startedAt).toLocaleString()}</td>
                            <td>
                                {l.finishedAt
                                    ? new Date(l.finishedAt).toLocaleString()
                                    : "-"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}