import { Suspense } from 'react';
import Link from 'next/link';
import {
    ArrowRightIcon,
    ClipboardListIcon,
    DumbbellIcon,
    PlusIcon,
    UsersIcon,
    type LucideIcon
} from 'lucide-react';

import { getAuthUserFirstName } from '@/features/auth';
import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';
import { getClientListPath, getNewClientPath } from '@/features/clients';
import { getExerciseListPath, getNewExercisePath } from '@/features/exercises';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    PageContainer,
    PageHeader,
    Skeleton,
    Tile,
    TileGrid,
    TileLink,
    buttonVariants
} from '@/shared';

const gettingStartedSteps = [
    {
        title: 'Uzupełnij bibliotekę ćwiczeń',
        description: 'Dodaj własne ćwiczenia albo skopiuj gotowe z katalogu.',
        href: getExerciseListPath()
    },
    {
        title: 'Dodaj podopiecznego',
        description: 'Wystarczą imię, nazwisko i adres e-mail.',
        href: getNewClientPath()
    },
    {
        title: 'Utwórz blok treningowy',
        description: 'W profilu podopiecznego, w sekcji „Bloki treningowe”, dodaj blok.',
        href: getClientListPath()
    }
];

function SectionTile({
    icon: Icon,
    title,
    description,
    href,
    actionLabel,
    actionHref
}: {
    icon: LucideIcon;
    title: string;
    description: string;
    href: string;
    actionLabel: string;
    actionHref: string;
}) {
    return (
        <Tile interactive>
            <CardHeader>
                <span className='bg-muted mb-2 flex size-10 items-center justify-center rounded-lg'>
                    <Icon className='size-5' />
                </span>
                <CardTitle className='text-lg'>
                    <TileLink href={href}>{title}</TileLink>
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardFooter className='mt-auto justify-between gap-2'>
                <span className='text-muted-foreground flex items-center gap-1 text-sm'>
                    Przejdź
                    <ArrowRightIcon className='size-4' />
                </span>
                <Link
                    href={actionHref}
                    className={buttonVariants({
                        variant: 'outline',
                        size: 'sm',
                        className: 'relative z-10'
                    })}
                >
                    <PlusIcon data-icon='inline-start' />
                    {actionLabel}
                </Link>
            </CardFooter>
        </Tile>
    );
}

function GettingStarted() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <ClipboardListIcon className='size-4' />
                    Jak ułożyć plan treningowy
                </CardTitle>
                <CardDescription>Trzy kroki od pustego konta do pierwszego bloku.</CardDescription>
            </CardHeader>
            <CardContent>
                <ol className='grid gap-3 md:grid-cols-3'>
                    {gettingStartedSteps.map((step, index) => (
                        <li key={step.title}>
                            <Link
                                href={step.href}
                                className='hover:bg-muted/60 focus-visible:ring-ring/50 flex h-full gap-3 rounded-lg border p-3 transition-colors outline-none focus-visible:ring-3'
                            >
                                <span className='bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium'>
                                    {index + 1}
                                </span>
                                <span className='flex flex-col gap-0.5'>
                                    <span className='text-sm font-medium'>{step.title}</span>
                                    <span className='text-muted-foreground text-sm'>
                                        {step.description}
                                    </span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ol>
            </CardContent>
        </Card>
    );
}

async function DashboardGreeting() {
    const user = await getAuthenticatedUserOrRedirect();

    return (
        <PageHeader
            title={`Cześć, ${getAuthUserFirstName(user)}!`}
            description='Od czego chcesz zacząć?'
        />
    );
}

function DashboardGreetingSkeleton() {
    return (
        <div className='flex flex-col gap-2'>
            <Skeleton className='h-8 w-56' />
            <Skeleton className='h-4 w-40' />
        </div>
    );
}

export default function DashboardPage() {
    return (
        <PageContainer>
            <Suspense fallback={<DashboardGreetingSkeleton />}>
                <DashboardGreeting />
            </Suspense>
            <TileGrid columns={2}>
                <SectionTile
                    icon={UsersIcon}
                    title='Podopieczni'
                    description='Dane kontaktowe, status współpracy i plany treningowe Twoich podopiecznych.'
                    href={getClientListPath()}
                    actionLabel='Dodaj podopiecznego'
                    actionHref={getNewClientPath()}
                />
                <SectionTile
                    icon={DumbbellIcon}
                    title='Biblioteka ćwiczeń'
                    description='Własne ćwiczenia i pozycje z katalogu, z których układasz plany.'
                    href={getExerciseListPath()}
                    actionLabel='Dodaj ćwiczenie'
                    actionHref={getNewExercisePath()}
                />
            </TileGrid>
            <GettingStarted />
        </PageContainer>
    );
}
