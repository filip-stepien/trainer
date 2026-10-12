export function getInitials({ name }: { name: string }) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toLocaleUpperCase('pl-PL'))
        .join('');
}
