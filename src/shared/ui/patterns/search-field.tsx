import { SearchIcon } from 'lucide-react';

import { Input } from '@/shared/ui/components/input';
import { Spinner } from '@/shared/ui/components/spinner';
import { cn } from '@/shared/ui/lib/utils';

export function SearchField({
    className,
    isPending = false,
    ...props
}: Omit<React.ComponentProps<typeof Input>, 'type'> & { isPending?: boolean }) {
    return (
        <div className={cn('relative', className)}>
            <SearchIcon
                aria-hidden='true'
                className='text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2'
            />
            <Input type='search' className='pr-8 pl-8' {...props} />
            {isPending ? (
                <Spinner className='text-muted-foreground absolute top-1/2 right-2.5 size-4 -translate-y-1/2' />
            ) : null}
        </div>
    );
}
