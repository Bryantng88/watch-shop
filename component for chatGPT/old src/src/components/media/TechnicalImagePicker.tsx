"use client";

import * as React from "react";
import MediaPickerInline from "./MediaPickerInline";

type Props = {
    value: string | null;
    onChange: (fileKey: string) => void;
    disabled?: boolean;
    pending?: boolean;
    compact?: boolean;
    className?: string;
};

export default function TechnicalImagePicker({
    value,
    onChange,
    disabled = false,
    pending = false,
    compact = true,
    className,
}: Props) {
    return (
        <MediaPickerInline
            value={value}
            onChange={onChange}
            disabled={disabled}
            pending={pending}
            compact={compact}
            className={className}
            profile="technical-inline"
        />
    );
}