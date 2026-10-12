'use client';

import { ChevronsUpDownIcon, LogOutIcon } from 'lucide-react';

import {
    Avatar,
    AvatarFallback,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    getInitials
} from '@/shared';

import type { AuthUser } from '../../domain/user';
import { useSignOut } from '../hooks/use-sign-out';

function UserIdentity({ user }: { user: Pick<AuthUser, 'name' | 'email'> }) {
    return (
        <>
            <Avatar className='size-8 rounded-lg'>
                <AvatarFallback className='rounded-lg'>
                    {getInitials({ name: user.name })}
                </AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{user.name}</span>
                <span className='text-muted-foreground truncate text-xs'>{user.email}</span>
            </div>
        </>
    );
}

export function UserMenu({ user }: { user: Pick<AuthUser, 'name' | 'email'> }) {
    const { signOut, isPending } = useSignOut();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <SidebarMenuButton
                                size='lg'
                                className='aria-expanded:bg-sidebar-accent'
                            />
                        }
                    >
                        <UserIdentity user={user} />
                        <ChevronsUpDownIcon className='ml-auto size-4' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className='min-w-56'
                        side='right'
                        align='end'
                        sideOffset={4}
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className='p-0 font-normal'>
                                <div className='flex items-center gap-2 px-1 py-1.5'>
                                    <UserIdentity user={user} />
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={signOut} disabled={isPending}>
                            <LogOutIcon />
                            {isPending ? 'Wylogowywanie…' : 'Wyloguj się'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
