'use client';

import { useEffect } from 'react';
import { ArrowLeftIcon, InfoIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/ui/components/button';
import { useReturnPoint } from '@/shared/ui/hooks/use-return-point';
import type { ReturnPoint } from '@/shared/ui/lib/return-point';

const returnPointToastId = 'return-point';

function ReturnPointToastContent({
    returnPoint,
    onReturn
}: {
    returnPoint: ReturnPoint;
    onReturn: () => void;
}) {
    return (
        <div className='bg-popover text-popover-foreground flex w-(--width) max-w-[calc(100vw-2rem)] flex-col gap-3 rounded-xl border p-4 shadow-lg'>
            <div className='flex items-start gap-3'>
                <InfoIcon className='mt-0.5 size-4 shrink-0' />
                <div className='flex flex-col gap-1'>
                    <p className='text-sm font-medium'>{returnPoint.title}</p>
                    <p className='text-muted-foreground text-sm'>{returnPoint.description}</p>
                </div>
            </div>
            <Button size='sm' className='w-full' onClick={onReturn}>
                <ArrowLeftIcon data-icon='inline-start' />
                {returnPoint.actionLabel}
            </Button>
        </div>
    );
}

export function ReturnPointToast() {
    const { visibleReturnPoint, returnToPoint } = useReturnPoint();

    useEffect(() => {
        if (!visibleReturnPoint) {
            toast.dismiss(returnPointToastId);
            return;
        }

        toast.custom(
            () => (
                <ReturnPointToastContent
                    returnPoint={visibleReturnPoint}
                    onReturn={returnToPoint}
                />
            ),
            { id: returnPointToastId, duration: Infinity, dismissible: false }
        );
    }, [visibleReturnPoint, returnToPoint]);

    return null;
}
