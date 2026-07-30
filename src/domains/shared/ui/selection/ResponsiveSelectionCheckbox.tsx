"use client";

import {
  startTransition,
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react";

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "checked" | "defaultChecked" | "onChange" | "type"
> & {
  checked: boolean;
  indeterminate?: boolean;
  onCheckedChange: (checked: boolean) => void;
};

/**
 * Paints checkbox feedback immediately while list-level selection and bulk
 * calculations are scheduled as non-urgent work.
 */
export function ResponsiveSelectionCheckbox({
  checked,
  indeterminate = false,
  onCheckedChange,
  ...props
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [visualChecked, setVisualChecked] = useState(checked);

  useEffect(() => {
    setVisualChecked(checked);
  }, [checked]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      {...props}
      ref={inputRef}
      type="checkbox"
      checked={visualChecked}
      onChange={(event) => {
        const nextChecked = event.target.checked;
        setVisualChecked(nextChecked);
        startTransition(() => onCheckedChange(nextChecked));
      }}
    />
  );
}
