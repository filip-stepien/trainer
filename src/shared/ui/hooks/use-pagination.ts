'use client';

import { useState } from 'react';

import { getPageSlice } from '../lib/pagination';

export function usePagination<Item>({ items, pageSize }: { items: Item[]; pageSize: number }) {
    const [requestedPage, setRequestedPage] = useState(0);
    const pageSlice = getPageSlice({ items, requestedPage, pageSize });

    function goToPreviousPage() {
        setRequestedPage(pageSlice.page - 1);
    }

    function goToNextPage() {
        setRequestedPage(pageSlice.page + 1);
    }

    return { ...pageSlice, goToPreviousPage, goToNextPage };
}
