import { AppSidebar } from '@/shared/ui/components/blocks/dashboard/app-sidebar';
import { ChartAreaInteractive } from '@/shared/ui/components/blocks/dashboard/chart-area-interactive';
import { DataTable } from '@/shared/ui/components/blocks/dashboard/data-table';
import { SectionCards } from '@/shared/ui/components/blocks/dashboard/section-cards';
import { SiteHeader } from '@/shared/ui/components/blocks/dashboard/site-header';
import { SidebarInset, SidebarProvider } from '@/shared/ui/components/sidebar';

import data from './data.json';

export default function DashboardExamplePage() {
    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)'
                } as React.CSSProperties
            }
        >
            <AppSidebar variant='inset' />
            <SidebarInset>
                <SiteHeader />
                <div className='flex flex-1 flex-col'>
                    <div className='@container/main flex flex-1 flex-col gap-2'>
                        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
                            <SectionCards />
                            <div className='px-4 lg:px-6'>
                                <ChartAreaInteractive />
                            </div>
                            <DataTable data={data} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
