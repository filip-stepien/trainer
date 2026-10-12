export function normalizeSearchText(value: string) {
    return value
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLocaleLowerCase('pl-PL')
        .replaceAll('ł', 'l')
        .trim();
}
