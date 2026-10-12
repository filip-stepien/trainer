const pluralRules = new Intl.PluralRules('pl-PL');

export function formatCount({
    count,
    one,
    few,
    many
}: {
    count: number;
    one: string;
    few: string;
    many: string;
}) {
    const category = pluralRules.select(count);
    const form = category === 'one' ? one : category === 'few' ? few : many;
    return `${count} ${form}`;
}
