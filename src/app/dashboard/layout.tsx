import { Suspense } from 'react';

import { ReturnPointToast, SidebarInset, SidebarProvider, Toaster } from '@/shared';

import { AppHeader } from './_components/app-header';
import { AppSidebar } from './_components/app-sidebar';

export default function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <AppHeader />
                <div className='flex flex-1 flex-col'>{children}</div>
            </SidebarInset>
            <Toaster position='bottom-right' />
            <Suspense fallback={null}>
                <ReturnPointToast />
            </Suspense>
        </SidebarProvider>
    );
}
