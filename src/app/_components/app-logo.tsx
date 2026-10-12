import { DumbbellIcon } from 'lucide-react';

import { cn } from '@/shared';

export function AppLogoMark({ className }: { className?: string }) {
    return (
        <span
            className={cn(
                'bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg',
                className
            )}
        >
            <DumbbellIcon className='size-4' />
        </span>
    );
}

export function AppLogo({ className }: { className?: string }) {
    return (
        <span className={cn('flex items-center gap-2', className)}>
            <AppLogoMark />
            <span className='flex flex-col leading-tight'>
                <span className='text-sm font-semibold'>Trainer</span>
                <span className='text-muted-foreground text-xs'>Panel trenera</span>
            </span>
        </span>
    );
}
