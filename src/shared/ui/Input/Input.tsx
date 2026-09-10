import { forwardRef, useId } from "react";
import type { ComponentPropsWithRef, ChangeEvent, FocusEvent } from "react";
import { getStyles } from "@/shared/lib";
import styles from "./Input.module.scss";
import { Stack } from "../Stack/Stack";
import { Typography } from "../Typography";

// 1. Описываем кастомные пропсы компонента без any
interface InputCustomProps {
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  max?: boolean;
  // Полная строгая типизация для методов react-hook-form
  register?: {
    onChange?: (event: ChangeEvent<HTMLInputElement>) => Promise<boolean | void> | void;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => Promise<boolean | void> | void;
    ref?: (node: HTMLInputElement | null) => void;
    name?: string;
  };
  ariaLabel?: string;
}

export interface InputProps 
  extends Omit<ComponentPropsWithRef<"input">, keyof InputCustomProps>, 
    InputCustomProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    className,
    label,
    isError,
    errorMessage,
    max,
    register,
    disabled,
    ariaLabel,
    ...otherProps
}, ref) => {

    const id = useId();

    const mode = {
        [styles.error]: !!isError,
    };

    const setRefs = (node: HTMLInputElement | null) => {
        if (register?.ref) register.ref(node);

        if (typeof ref === "function") {
            ref(node);
        } else if (ref && "current" in ref) {
            ref.current = node;
        }
    };

    return (
        <Stack direction="column" gap={8} max={max}>
            {label && (
                <label className={styles.label} htmlFor={id}>
                    {label}
                </label>
            )}
            
            <input
                className={getStyles(styles.input, mode, [className])}
                id={id}
                ref={setRefs}
                disabled={disabled}
                aria-label={ariaLabel || label}
                {...register}
                {...otherProps}
            />

            {isError && errorMessage && (
                <Typography 
                    variant='body12'
                    className={styles.errorMessage}
                >
                    {errorMessage}
                </Typography>
            )}
        </Stack>
    );
});

Input.displayName = "Input";
