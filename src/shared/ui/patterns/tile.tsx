import Link from 'next/link';

import { Card } from '@/shared/ui/components/card';
import { cn } from '@/shared/ui/lib/utils';

export function TileGrid({
    className,
    columns = 3,
    ...props
}: React.ComponentProps<'div'> & { columns?: 2 | 3 | 4 }) {
    return (
        <div
            className={cn(
                'grid gap-4 sm:grid-cols-2',
                columns === 3 && 'xl:grid-cols-3',
                columns === 4 && 'lg:grid-cols-3 xl:grid-cols-4',
                className
            )}
            {...props}
        />
    );
}

export function Tile({
    className,
    interactive = false,
    ...props
}: React.ComponentProps<typeof Card> & { interactive?: boolean }) {
    return (
        <Card
            data-interactive={interactive || undefined}
            className={cn(
                interactive &&
                    'hover:ring-foreground/20 has-[[data-slot=tile-link]:focus-visible]:ring-ring relative transition-shadow hover:shadow-md has-[[data-slot=tile-link]:focus-visible]:ring-2',
                className
            )}
            {...props}
        />
    );
}

export function TileLink({ className, ...props }: React.ComponentProps<typeof Link>) {
    return (
        <Link
            data-slot='tile-link'
            className={cn(
                'outline-none after:absolute after:inset-0 after:rounded-xl after:content-[""]',
                className
            )}
            {...props}
        />
    );
}

export function addTileVariants({ className }: { className?: string } = {}) {
    return cn(
        'border-border text-muted-foreground hover:border-foreground/30 hover:bg-muted/40 hover:text-foreground focus-visible:ring-ring/50 flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center text-sm font-medium transition-colors outline-none focus-visible:ring-3 [&_svg]:size-5',
        className
    );
}

export function AddTile({ className, type = 'button', ...props }: React.ComponentProps<'button'>) {
    return <button type={type} className={addTileVariants({ className })} {...props} />;
}
