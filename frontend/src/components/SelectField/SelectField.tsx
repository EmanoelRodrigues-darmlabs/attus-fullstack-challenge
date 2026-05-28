import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export interface SelectOption<TValue extends string> {
  value: TValue;
  label: string;
}

interface SelectFieldProps<TValue extends string> {
  value: TValue;
  options: Array<SelectOption<TValue>>;
  onChange: (value: TValue) => void;
  ariaLabel?: string;
  id?: string;
  label?: string;
  disabled?: boolean;
  size?: "small" | "medium";
}

export function SelectField<TValue extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  id,
  label,
  disabled = false,
  size = "medium"
}: SelectFieldProps<TValue>) {
  const labelId = id ? `${id}-label` : undefined;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleScroll() {
      setOpen(false);
    }

    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [open]);

  return (
    <FormControl fullWidth size={size}>
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <Select
        id={id}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        labelId={labelId}
        value={value}
        label={label}
        disabled={disabled}
        inputProps={{ "aria-label": ariaLabel }}
        MenuProps={{ disableScrollLock: true }}
        onChange={(event) => onChange(event.target.value as TValue)}
      >
        {options.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
