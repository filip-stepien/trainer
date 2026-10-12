import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/shared/ui/components/breadcrumb';
import { Button } from '@/shared/ui/components/button';
import { Skeleton } from '@/shared/ui/components/skeleton';
import { cn } from '@/shared/ui/lib/utils';

export type PageBreadcrumb = {
    label: string;
    href?: string;
};

function PageBreadcrumbs({ items }: { items: PageBreadcrumb[] }) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, index) => (
                    <Fragment key={`${item.label}-${index}`}>
                        {index > 0 ? <BreadcrumbSeparator /> : null}
                        <BreadcrumbItem>
                            {item.href ? (
                                <BreadcrumbLink render={<Link href={item.href} />}>
                                    {item.label}
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

function PageBackButton({ href }: { href: string }) {
    return (
        <Button variant='outline' render={<Link href={href} />} nativeButton={false}>
            <ArrowLeftIcon data-icon='inline-start' />
            Wstecz
        </Button>
    );
}

export function PageContainer({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn(
                'mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8',
                className
            )}
            {...props}
        />
    );
}

export function PageHeader({
    title,
    description,
    breadcrumbs,
    backHref,
    leading,
    badges,
    actions
}: {
    title: ReactNode;
    description?: ReactNode;
    breadcrumbs?: PageBreadcrumb[];
    backHref?: string;
    leading?: ReactNode;
    badges?: ReactNode;
    actions?: ReactNode;
}) {
    const parentHref = backHref ?? breadcrumbs?.findLast(item => item.href)?.href;

    return (
        <header className='flex flex-col gap-4'>
            {parentHref || breadcrumbs?.length ? (
                <div className='flex flex-wrap items-center gap-3'>
                    {parentHref ? <PageBackButton href={parentHref} /> : null}
                    {breadcrumbs?.length ? <PageBreadcrumbs items={breadcrumbs} /> : null}
                </div>
            ) : null}
            <div className='flex flex-wrap items-start justify-between gap-4'>
                <div className='flex min-w-0 items-center gap-4'>
                    {leading}
                    <div className='flex min-w-0 flex-col gap-1'>
                        <div className='flex flex-wrap items-center gap-2'>
                            <h1 className='truncate text-2xl font-semibold tracking-tight'>
                                {title}
                            </h1>
                            {badges}
                        </div>
                        {description ? (
                            <p className='text-muted-foreground text-sm'>{description}</p>
                        ) : null}
                    </div>
                </div>
                {actions ? (
                    <div className='flex flex-wrap items-center gap-2'>{actions}</div>
                ) : null}
            </div>
        </header>
    );
}

export function PageSection({
    title,
    description,
    actions,
    className,
    children
}: {
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    className?: string;
    children: ReactNode;
}) {
    return (
        <section className={cn('flex flex-col gap-4', className)}>
            <div className='flex flex-wrap items-end justify-between gap-3'>
                <div className='flex flex-col gap-1'>
                    <h2 className='text-lg font-semibold tracking-tight'>{title}</h2>
                    {description ? (
                        <p className='text-muted-foreground text-sm'>{description}</p>
                    ) : null}
                </div>
                {actions ? (
                    <div className='flex flex-wrap items-center gap-2'>{actions}</div>
                ) : null}
            </div>
            {children}
        </section>
    );
}

export function TileGridSkeleton({ tiles = 6 }: { tiles?: number }) {
    return (
        <div
            className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'
            role='status'
            aria-label='Ładowanie'
        >
            {Array.from({ length: tiles }, (_, index) => (
                <Skeleton key={index} className='h-36 rounded-xl' />
            ))}
        </div>
    );
}

export function PageSkeleton({ tiles = 6 }: { tiles?: number }) {
    return (
        <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-3'>
                <Skeleton className='h-4 w-40' />
                <Skeleton className='h-8 w-64' />
                <Skeleton className='h-4 w-80 max-w-full' />
            </div>
            <TileGridSkeleton tiles={tiles} />
        </div>
    );
}
