export const getStyles = (
    style: string | undefined | null | false, 
    mods: Record<string, boolean | undefined | null | false> = {}, 
    additional: (string | undefined | null | false)[] | string = []
): string => {
    // 1. Собираем классы-модификаторы, у которых значение истинно
    const modeStyle = Object.entries(mods)
        .filter(([, value]) => Boolean(value))
        .map(([key]) => key);

    // 2. Приводим дополнительные классы к единому массиву
    const additionalArr = Array.isArray(additional) ? additional : [additional];

    // 3. Соединяем всё вместе, фильтруя пустые значения (false, null, undefined, "")
    return [style, ...modeStyle, ...additionalArr]
        .filter((item): item is string => typeof item === 'string' && item.trim() !== '')
        .join(' ');
};