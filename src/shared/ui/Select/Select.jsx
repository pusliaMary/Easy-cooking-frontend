import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Stack } from "../Stack/Stack";
import { getStyles } from "../../lib";
import { Typography } from "../Typography";
import styles from "./Select.module.scss";


export const Select = ({
    label,
    options,
    value,
    onChange,
    placeholder = "Select an option",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)){
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (newValue) => {
        onChange?.(newValue);
        setIsOpen(false);
    };

    const selectedOption = options.find(
        (opt) => opt.value.toLowerCase() === value?.toLowerCase()
    )

    return(
        <Stack
        direction="column"
        fullWidth
        gap={8}
        ref={selectRef}
        >
            {label &&
            <label className={styles.label}>
                {label}
            </label>
            }
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
            className={getStyles(styles.arrow, { [styles.arrowOpen]: isOpen}, [])}
            />
        </button>

        {isOpen && (
            <div className={styles.menu}>
                {options.map((option) => (
                    <Stack
                    key={option.value}
                    align='center'
                    justify="between"
                    gap={8}
                    className={getStyles(styles.option, {[styles.selected]: option.value === value}, [] )}
                    onClick={() => handleSelect(option.value)}
                    >
                        <Typography>{option.label}</Typography>
                        {option.value === value && 
                            (<Check size={16}/>)}
                    </Stack>
                ))}
                </div>
            )}
        </Stack>    
    </Stack>
    );
    };