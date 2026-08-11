import { forwardRef, useId } from "react";
import { getStyles } from "../../lib/getStyle/getStyle";
import styles from "./Input.module.scss";
import { Stack } from "../Stack/Stack";
import { Typography } from "../Typography";
import type { ComponentPropsWithRef } from "react";

// 1. Описываем кастомные пропсы компонента
interface InputCustomProps {
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  max?: boolean;
  // Типизация для React Hook Form register (или аналогичной библиотеки)
  register?: {
    onChange?: (...args: any[]) => void;
    onBlur?: (...args: any[]) => void;
    ref?: (node: HTMLInputElement | null) => void;
    name?: string;
  };
  ariaLabel?: string;
}

// 2. Объединяем наши пропсы со стандартными атрибутами нативного тега <input>
// Используем Omit, чтобы наши кастомные поля (например, disabled) не конфликтовали
export interface InputProps 
  extends Omit<ComponentPropsWithRef<"input">, keyof InputCustomProps>, 
    InputCustomProps {}

// 3. Передаем типы в forwardRef: <Тип_Ref_Элемента, Тип_Пропсов>
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
        [styles.error]: !!isError, // приведение к boolean для безопасности
    };

    // Исправленная и типизированная функция объединения рефов
    const setRefs = (node: HTMLInputElement | null) => {
        if (register?.ref) register.ref(node);

        if (typeof ref === "function") {
            ref(node);
        } else if (ref && "current" in ref) {
            ref.current = node;
        }
    };

    return (
        <Stack direction="column" gap={8} max>
            <label className={styles.label} htmlFor={id}>
                {label}
                <input
                    className={getStyles(styles.input, mode, [className])}
                    id={id}
                    ref={setRefs}
                    disabled={disabled}
                    aria-label={ariaLabel}
                    {...register}
                    {...otherProps}
                />
            </label>

            {/* Отрендерит блок ошибки только если isError === true и есть текст сообщения */}
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
