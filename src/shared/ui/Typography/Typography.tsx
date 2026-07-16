import React from 'react';
import type { ElementType, ComponentPropsWithoutRef } from 'react';
import { getStyles } from '../../lib/getStyle/getStyle';
import styles from './Typography.module.scss';

// Типы для возможных значений пропсов
export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body16' | 'body14' | 'body12';
export type TypographyWeight = 'normal' | 'bold';
export type TypographyFont = 'lato' | 'poiretOne';

// Маппинг тегов по умолчанию
const DEFAULT_TAG_BY_VARIANT: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body16: 'p',
  body14: 'p',
  body12: 'p',
};

// Собственные пропсы компонента Typography
export interface TypographyOwnProps<T extends ElementType = ElementType> {
  variant?: TypographyVariant;
  children?: React.ReactNode;
  as?: T;
  weight?: TypographyWeight;
  font?: TypographyFont;
  tabularNumbers?: boolean;
  noMargin?: boolean;
  className?: string;
}

// Комбинируем собственные пропсы с валидными HTML-атрибутами выбранного тега
export type TypographyProps<T extends ElementType> = TypographyOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TypographyOwnProps<T>>;

export const Typography = <T extends ElementType = 'p'>({
  variant = 'body16',
  children,
  as,
  weight,
  font = 'lato',
  tabularNumbers,
  noMargin = true,
  className,
  ...otherProps
}: TypographyProps<T>) => {
  // Определяем итоговый HTML-тег
  const TextTag = as || DEFAULT_TAG_BY_VARIANT[variant] || 'p';

  const mode = {
    [styles.tabularNumbers]: !!tabularNumbers,
    [styles.noMargin]: !!noMargin,
  };

  const additional = [
    styles[variant],
    weight ? styles[weight] : '',
    styles[font],
    className,
  ];

  return (
    <TextTag 
      className={getStyles(styles.typography || '', mode, additional)} 
      {...otherProps}
    >
      {children}
    </TextTag>
  );
};
