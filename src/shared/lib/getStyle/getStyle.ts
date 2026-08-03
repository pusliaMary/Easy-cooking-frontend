export const getStyles = (
    style: string, 
    mods: Record<string, boolean | undefined | null> = {}, 
    additional: (string | undefined | null | false)[] | string = []
) => {
    const modeStyle = Object.entries(mods)
        .filter(([, value]) => Boolean(value))
        .map(([key]) => key);

    
    const additionalArr = Array.isArray(additional) ? additional : [additional];

    
    return [style, ...modeStyle, ...additionalArr]
        .filter((item): item is string => Boolean(item))
        .join(' ');
}