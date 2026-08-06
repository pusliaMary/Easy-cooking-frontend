import { forwardRef, useId } from "react";
import { getStyles } from "../../lib/getStyle/getStyle";
import styles from "./Input.module.scss";
import { Stack } from "../Stack/Stack";
import { Typography } from "../Typography";

export const Input = forwardRef(({
    className,
    label,
    isError, //boolean
    errorMessage, //string 
    fullWidth, //boolean для позиционирования по ширине контейнера
    register,
    disabled,
    ariaLabel,
    ...otherProps
}, ref) => {

    const id = useId();

    const mode = {
        [styles.error]: isError,
    };

    const setRefs = (node) => {
        if (register?.ref) register.ref(node);

        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
    };

    return (
        <Stack direction="column" gap="8" fullWidth={fullWidth}>
            <label className={styles.label}>
                {label}
                <input
                    className={getStyles(styles.input, mode, [className])}
                    id={id}
                    ref={setRefs}
                    {...register}
                    {...otherProps}
                />
            </label>

            <Typography type="span" size="xxs"
                className={styles.errorMessage}
            >
                {isError && errorMessage}
            </Typography>
        </Stack>
    );
});

Input.displayName = "Input";