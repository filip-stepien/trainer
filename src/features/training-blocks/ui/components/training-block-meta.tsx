import { CalendarIcon, TimerIcon } from 'lucide-react';

import { cn, formatDateForDisplay } from '@/shared';

import { formatTrainingBlockDuration } from '../lib/format';

export function TrainingBlockMeta({
    startDate,
    durationWeeks,
    className
}: {
    startDate: string;
    durationWeeks: number | null;
    className?: string;
}) {
    return (
        <span className={cn('flex flex-wrap items-center gap-x-4 gap-y-1', className)}>
            <span className='flex items-center gap-1.5'>
                <CalendarIcon className='size-4 shrink-0' />
                Start {formatDateForDisplay({ date: startDate })}
            </span>
            <span className='flex items-center gap-1.5'>
                <TimerIcon className='size-4 shrink-0' />
                {formatTrainingBlockDuration({ startDate, durationWeeks })}
            </span>
        </span>
    );
}
