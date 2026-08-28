import { forwardRef,  useMemo } from 'react';
import type {  TextareaHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { Stack } from '../Stack/Stack';
import styles from './TextArea.module.scss';
import { getStyles } from "@/shared/lib";
import { Typography } from '../Typography'; 

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: {
    message?: string;
  };
  register?: UseFormRegisterReturn;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, register, className, error, maxLength, value, ...otherProps }, ref) => {
    
    const mode = {
      [styles.error]: !!error,
    };

    
    const charCount = useMemo(() => {
      if (!maxLength) return 0;
      return String(value ?? otherProps.defaultValue ?? '').length;
    }, [value, otherProps.defaultValue, maxLength]);

    return (
      <Stack direction="column" gap={8} max>
        {label && (
          <label className={styles.label}>
            {label}
            <textarea
              ref={ref}
              maxLength={maxLength}
              value={value}
              {...register}
              {...otherProps}
              className={getStyles(styles.textarea, mode, [className])}
            />
          </label>
        )}
        
        {(error?.message || maxLength) && (
          <div className={styles.fieldMeta}>
            {error?.message && (
              <Typography as="span" variant="body12" className={styles.errorMessage}>
                {error.message}
              </Typography>
            )}
            {maxLength && (
              <Typography as="span" variant="body12" className={styles.charCounter}>
                {charCount} / {maxLength}
              </Typography>
            )}
          </div>
        )}
      </Stack>
    );
  }
);

TextArea.displayName = 'TextArea';
