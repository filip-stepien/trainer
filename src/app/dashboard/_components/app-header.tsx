import { Separator, SidebarTrigger } from '@/shared';

import { AppLogo } from '../../_components/app-logo';

export function AppHeader() {
    return (
        <header className='bg-background/90 supports-backdrop-filter:bg-background/70 sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur md:rounded-t-xl'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-1 h-4 data-vertical:self-auto' />
            <AppLogo className='md:hidden' />
        </header>
    );
}
