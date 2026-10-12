import { Avatar, AvatarFallback, cn, getInitials } from '@/shared';

import { getClientFullName } from '../../domain/client';

export function ClientAvatar({
    firstName,
    lastName,
    size = 'default',
    onMutedBackground = false,
    className
}: {
    firstName: string;
    lastName: string;
    size?: 'default' | 'lg';
    onMutedBackground?: boolean;
    className?: string;
}) {
    return (
        <Avatar size='lg' className={cn(size === 'lg' && 'size-14', className)}>
            <AvatarFallback
                className={cn(
                    'font-medium',
                    size === 'lg' && 'text-lg',
                    onMutedBackground && 'bg-background'
                )}
            >
                {getInitials({ name: getClientFullName({ firstName, lastName }) })}
            </AvatarFallback>
        </Avatar>
    );
}
