const dateFormatter = new Intl.DateTimeFormat('en', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
});

export function toDateString({ date }: { date: Date }) {
    const parts = Object.fromEntries(
        dateFormatter.formatToParts(date).map(part => [part.type, part.value])
    );

    return `${parts.year}-${parts.month}-${parts.day}`;
}

export function formatDateForDisplay({ date }: { date: string }) {
    return date.split('-').reverse().join('.');
}
