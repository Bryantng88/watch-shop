"use client";

export function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="mb-1 block text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">
            {children}
        </label>
    );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={cx(
                "block h-[40px] w-full border-0 border-b border-slate-200 bg-transparent px-0 text-sm text-slate-900 outline-none placeholder:text-slate-300 transition focus:border-slate-400 focus:ring-0",
                props.className
            )}
        />
    );
}

export function Select(
    props: React.SelectHTMLAttributes<HTMLSelectElement> & {
        options: Array<{ value: string; label: string }>;
        placeholder?: string;
    }
) {
    const { options, placeholder, ...rest } = props;

    return (
        <select
            {...rest}
            className={cx(
                "block h-[40px] w-full border-0 border-b border-slate-200 bg-transparent px-0 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-0",
                rest.className
            )}
        >
            {placeholder ? <option value="">{placeholder}</option> : null}
            {options.map((item) => (
                <option key={item.value} value={item.value}>
                    {item.label}
                </option>
            ))}
        </select>
    );
}

export function Textarea(
    props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
    return (
        <textarea
            {...props}
            className={cx(
                "block min-h-[100px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-300 transition focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100",
                props.className
            )}
        />
    );
}

export function Button({
    variant = "default",
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "ghost";
}) {
    return (
        <button
            {...props}
            className={cx(
                "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
                variant === "default" &&
                "bg-slate-950 text-white hover:bg-slate-800",
                variant === "outline" &&
                "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                variant === "ghost" &&
                "bg-transparent text-slate-600 hover:bg-slate-100",
                className
            )}
        />
    );
}

export function Toggle({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (next: boolean) => void;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={cx(
                "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                checked
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
        >
            <span
                className={cx(
                    "h-2.5 w-2.5 rounded-full",
                    checked ? "bg-white" : "bg-slate-300"
                )}
            />
            {label}
        </button>
    );
}

export function moneyPreview(v?: string) {
    if (!v) return "-";
    const n = Number(String(v).replace(/[^\d.-]/g, ""));
    if (!Number.isFinite(n)) return "-";
    return `${new Intl.NumberFormat("vi-VN").format(n)} VND`;
}