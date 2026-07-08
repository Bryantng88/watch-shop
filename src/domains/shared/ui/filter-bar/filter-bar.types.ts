export type FilterBarOption = {
    label: string;
    value: string;
};

export type FilterBarField = {
    key: string;
    label: string;
    type: "select";
    options: FilterBarOption[];
    defaultValue?: string;
};

export type FilterBarSearch = {
    key: string;
    placeholder?: string;
};

export type FilterBarValues = Record<string, string>;
