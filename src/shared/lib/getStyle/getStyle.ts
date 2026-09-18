export const getStyles = (
  style: string | undefined | null | false,
  mods: Record<string, boolean | undefined | null | false> = {},
  additional: (string | undefined | null | false)[] | string = [],
): string => {
  const modeStyle = Object.entries(mods)
    .filter(([, value]) => Boolean(value))
    .map(([key]) => key);

  const additionalArr = Array.isArray(additional) ? additional : [additional];

  return [style, ...modeStyle, ...additionalArr]
    .filter(
      (item): item is string => typeof item === "string" && item.trim() !== "",
    )
    .join(" ");
};
