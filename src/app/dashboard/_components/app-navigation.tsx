'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DumbbellIcon, LayoutDashboardIcon, UsersIcon, type LucideIcon } from 'lucide-react';

import { getDashboardPath } from '@/features/auth';
import { getClientListPath, isClientSectionPath } from '@/features/clients';
import { getExerciseListPath, isExerciseSectionPath } from '@/features/exercises';
import { isTrainingBlockSectionPath } from '@/features/training-blocks';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/shared';
import { useSidebar } from '@/shared/client';

type NavigationItem = {
    title: string;
    href: string;
    icon: LucideIcon;
    isActive: (pathname: string) => boolean;
};

const navigationItems: NavigationItem[] = [
    {
        title: 'Pulpit',
        href: getDashboardPath(),
        icon: LayoutDashboardIcon,
        isActive: pathname => pathname === getDashboardPath()
    },
    {
        title: 'Podopieczni',
        href: getClientListPath(),
        icon: UsersIcon,
        isActive: pathname =>
            isClientSectionPath({ pathname }) || isTrainingBlockSectionPath({ pathname })
    },
    {
        title: 'Biblioteka ćwiczeń',
        href: getExerciseListPath(),
        icon: DumbbellIcon,
        isActive: pathname => isExerciseSectionPath({ pathname })
    }
];

export function AppNavigationMenu({ pathname }: { pathname: string | null }) {
    const { setOpenMobile } = useSidebar();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {navigationItems.map(item => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                isActive={pathname ? item.isActive(pathname) : false}
                                render={
                                    <Link href={item.href} onClick={() => setOpenMobile(false)} />
                                }
                            >
                                <item.icon />
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

export function AppNavigation() {
    const pathname = usePathname();

    return <AppNavigationMenu pathname={pathname} />;
}
