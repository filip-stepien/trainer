import { Suspense } from 'react';
import Link from 'next/link';

import { getDashboardPath, UserMenu } from '@/features/auth';
import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    Skeleton
} from '@/shared';

import { AppLogo } from '../../_components/app-logo';
import { AppNavigation, AppNavigationMenu } from './app-navigation';

async function SidebarUser() {
    const user = await getAuthenticatedUserOrRedirect();

    return <UserMenu user={{ name: user.name, email: user.email }} />;
}

function SidebarUserSkeleton() {
    return (
        <div className='flex h-12 items-center gap-2 px-2' aria-hidden='true'>
            <Skeleton className='size-8 shrink-0 rounded-lg' />
            <div className='flex flex-1 flex-col gap-1.5 group-data-[collapsible=icon]:hidden'>
                <Skeleton className='h-3 w-24' />
                <Skeleton className='h-3 w-32' />
            </div>
        </div>
    );
}

export function AppSidebar() {
    return (
        <Sidebar variant='inset' collapsible='icon'>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size='lg'
                            render={<Link href={getDashboardPath()} />}
                            className='group-data-[collapsible=icon]:p-0!'
                        >
                            <AppLogo />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <Suspense fallback={<AppNavigationMenu pathname={null} />}>
                    <AppNavigation />
                </Suspense>
            </SidebarContent>
            <SidebarFooter>
                <Suspense fallback={<SidebarUserSkeleton />}>
                    <SidebarUser />
                </Suspense>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
