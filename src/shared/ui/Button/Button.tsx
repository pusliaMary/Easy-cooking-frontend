import { forwardRef, type ComponentPropsWithRef } from "react";
import { getStyles } from "@/shared/lib/getStyle/getStyle";
import styles from "./Button.module.scss";
import { Ellipsis } from "lucide-react";
import React from 'react';



export type variant = 'primary' | 'secondary'
export type size = 'xs' | 'sm' | 'md' | 'xl' | 'xxl'

export interface ButtonBaseProps {
  variant?: variant;
  children?: React.ReactNode;
  size?: size;
  isLoading?: boolean;
  ariaLabel?: boolean;
}

type ButtonProps = ButtonBaseProps & ComponentPropsWithRef<'button'>;



export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    className,
    variant = 'secondary',
    size = 'xs',
    isLoading,
    disabled,
    'aria-label': ariaLabel,
    ...otherProps
  },
  ref) => {

  const mode: Record<string, boolean | undefined> = {
    [styles.isLoading]: isLoading,
  }

  const additional = [
    styles[variant],
    styles[size],
    className
  ]

  const isDisabled = disabled || isLoading

  return (
    <button
      ref={ref}
      className={getStyles(styles.button, mode, additional)}
      disabled={isDisabled}
      aria-label={ariaLabel}
      {...otherProps}
    >

      {isLoading ? <Ellipsis className={styles.loader} /> : children}

    </button>

  )
});

Button.displayName = "Button";