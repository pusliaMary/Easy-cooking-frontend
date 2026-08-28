import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Stack } from "../Stack/Stack";
import { getStyles } from "@/shared/lib";
import { Typography } from "../Typography";
import styles from "./Select.module.scss";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
}, ref) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
    const localRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (localRef.current && !localRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newValue: string) => {
    onChange?.(newValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(
    (opt) => opt.value.toLowerCase() === value?.toLowerCase()
  );

  return (
    <Stack
      direction="column"
      max
      gap={8}
      ref={localRef}
    >
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}
      
      <Stack className={styles.buttonWrapper}>
        <button
          type="button"
          className={styles.selectField}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <Typography>
            {selectedOption ? selectedOption.label : placeholder}
          </Typography>
          <ChevronDown
            strokeWidth={0.75}
            size={28}
            className={getStyles(styles.arrow, { [styles.arrowOpen]: isOpen }, [])}
          />
        </button>

        {isOpen && (
          <div className={styles.menu} role="listbox">
            {options.map((option) => (
              <Stack
                key={option.value}
                align="center"
                justify="between"
                gap={8}
                className={getStyles(
                  styles.option,
                  { [styles.selected]: option.value === value },
                  []
                )}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={option.value === value}
              >
                <Typography>{option.label}</Typography>
                {option.value === value && <Check size={16} />}
              </Stack>
            ))}
          </div>
        )}
      </Stack>
    </Stack>
  );
});

Select.displayName = "Select";
