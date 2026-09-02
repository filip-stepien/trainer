const dateInputFormatter = new Intl.DateTimeFormat('en', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
});

export function formatDateForDisplay({ date }: { date: string }) {
    return date.split('-').reverse().join('.');
}

export function formatDateForInput({ date }: { date: Date }) {
    const parts = Object.fromEntries(
        dateInputFormatter.formatToParts(date).map(part => [part.type, part.value])
    );

    return `${parts.year}-${parts.month}-${parts.day}`;
}
