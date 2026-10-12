export function getPageSlice<Item>({
    items,
    requestedPage,
    pageSize
}: {
    items: Item[];
    requestedPage: number;
    pageSize: number;
}) {
    const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
    const page = Math.min(requestedPage, pageCount - 1);
    const firstIndex = page * pageSize;
    const visibleItems = items.slice(firstIndex, firstIndex + pageSize);

    return {
        page,
        pageCount,
        itemCount: items.length,
        visibleItems,
        firstItemNumber: firstIndex + 1,
        lastItemNumber: firstIndex + visibleItems.length,
        hasPreviousPage: page > 0,
        hasNextPage: page < pageCount - 1
    };
}
