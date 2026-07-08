export type FilterBarOption = {
    label: string;
    value: string;
};

export type FilterBarField = {
    key: string;
    label: string;
    type: "select" | "text";
    options?: FilterBarOption[];
    defaultValue?: string;
    placeholder?: string;
    inputMode?: "text" | "numeric" | "decimal";
};

export type FilterBarSearch = {
    key: string;
    placeholder?: string;
};

export type FilterBarValues = Record<string, string>;
