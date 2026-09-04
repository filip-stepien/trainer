export type PageData = {
    page: number;
    pageSize: number;
};

export function getPagePagination({ page, pageSize }: PageData) {
    return {
        limit: pageSize + 1,
        offset: (page - 1) * pageSize
    };
}

export function createPage<T>({ items, page, pageSize }: PageData & { items: T[] }) {
    return {
        items: items.slice(0, pageSize),
        hasPreviousPage: page > 1,
        hasNextPage: items.length > pageSize
    };
}
