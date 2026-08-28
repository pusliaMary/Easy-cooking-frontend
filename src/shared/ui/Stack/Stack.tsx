import { forwardRef } from "react";
import type { ReactNode, ComponentPropsWithRef } from "react";
import { getStyles } from "@/shared/lib";
import styles from "./Stack.module.scss";

type StackTag = "div" | "section" | "article" | "aside" | "main" | "nav" | "header";
type StackGap = 8 | 16 | 24 | 32 | 40 | 64;

export interface StackProps extends Omit<ComponentPropsWithRef<"div">, "direction" | "wrap"> {
  children?: ReactNode;
  className?: string;
  direction?: "row" | "column";
  align?: "center" | "end" | "start" | "stretch";
  justify?: "between" | "center" | "end" | "start" | "around";
  gap?: StackGap;
  tag?: StackTag;
  wrap?: boolean;
  max?: boolean;
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const Stack = forwardRef<HTMLElement, StackProps>((props, ref) => {
  const {
    children,
    className,
    direction,
    align,
    justify,
    gap,
    tag: Tag = "div",
    wrap,
    max,
    ...otherProps
  } = props;


  const justifyKey = justify ? `justify${capitalize(justify)}` : "";
  const alignKey = align ? `align${capitalize(align)}` : "";
  const directionKey = direction ? `direction${capitalize(direction)}` : "";
  const gapKey = gap ? `gap${gap}` : "";

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={getStyles(
        styles.flex, 
        { [styles.max]: !!max, [styles.wrap]: !!wrap }, 
        [
          justifyKey ? styles[justifyKey as keyof typeof styles] : undefined,
          alignKey ? styles[alignKey as keyof typeof styles] : undefined,
          directionKey ? styles[directionKey as keyof typeof styles] : undefined,
          gapKey ? styles[gapKey as keyof typeof styles] : undefined,
          className,
        ]
      )}
      {...otherProps}
    >
      {children}
    </Tag>
  );
});

Stack.displayName = "Stack";