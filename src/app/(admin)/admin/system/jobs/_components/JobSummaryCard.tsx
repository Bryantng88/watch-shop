type Props = {
    label: string;
    value: string;
    sub: string;
};

export default function JobSummaryCard({ label, value, sub }: Props) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium text-slate-500">{label}</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                {value}
            </div>
            <div className="mt-1 text-sm text-slate-500">{sub}</div>
        </div>
    );
}