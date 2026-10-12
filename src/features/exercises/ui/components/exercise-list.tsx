import Link from 'next/link';
import {
    ArrowRightIcon,
    BookOpenIcon,
    CheckIcon,
    DumbbellIcon,
    LibraryIcon,
    PlusIcon
} from 'lucide-react';

import {
    Badge,
    Button,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    Tabs,
    TabsList,
    TabsTrigger,
    Tile,
    TileGrid,
    TileLink,
    buttonVariants,
    cn
} from '@/shared';

import { isExerciseArchived } from '../../domain/exercise';
import { exerciseListStatusOptions } from '../lib/filtering';
import {
    ExerciseListStatus,
    ExerciseListView,
    getExerciseListHref,
    getExercisePath,
    getNewExercisePath
} from '../lib/routes';
import type {
    ExerciseCatalogListItem,
    ExerciseLibraryListItem,
    ExerciseListResult
} from '../queries/get-exercise-list-or-redirect';
import { AddExerciseFromCatalogForm } from './add-exercise-from-catalog-form';
import { ExerciseBadges } from './exercise-badges';
import { ExerciseSearch } from './exercise-search';
import { ExerciseStatusForm } from './exercise-status-form';

function ExerciseViewTabs({ view }: { view: ExerciseListView }) {
    return (
        <Tabs value={view} className='border-b'>
            <TabsList variant='line'>
                <TabsTrigger
                    value={ExerciseListView.Library}
                    nativeButton={false}
                    render={
                        <Link
                            href={getExerciseListHref({
                                view: ExerciseListView.Library,
                                page: 1,
                                search: '',
                                status: ExerciseListStatus.Active
                            })}
                        />
                    }
                >
                    <LibraryIcon />
                    Moja biblioteka
                </TabsTrigger>
                <TabsTrigger
                    value={ExerciseListView.Catalog}
                    nativeButton={false}
                    render={
                        <Link
                            href={getExerciseListHref({
                                view: ExerciseListView.Catalog,
                                page: 1,
                                search: '',
                                status: ExerciseListStatus.Active
                            })}
                        />
                    }
                >
                    <BookOpenIcon />
                    Katalog
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
}

function ExerciseStatusFilter({ search, status }: { search: string; status: ExerciseListStatus }) {
    return (
        <Tabs value={status}>
            <TabsList aria-label='Filtruj po statusie'>
                {exerciseListStatusOptions.map(option => (
                    <TabsTrigger
                        key={option.value}
                        value={option.value}
                        nativeButton={false}
                        render={
                            <Link
                                href={getExerciseListHref({
                                    view: ExerciseListView.Library,
                                    page: 1,
                                    search,
                                    status: option.value
                                })}
                            />
                        }
                    >
                        {option.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}

function ExerciseLibraryTile({ exercise }: { exercise: ExerciseLibraryListItem }) {
    return (
        <Tile interactive className={cn(isExerciseArchived(exercise) && 'opacity-75')}>
            <CardHeader>
                <CardTitle className='line-clamp-2'>
                    <TileLink href={getExercisePath({ exerciseId: exercise.id })}>
                        {exercise.name}
                    </TileLink>
                </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-1 flex-col gap-3'>
                <ExerciseBadges isCustom={exercise.isCustom} status={exercise.status} />
                <p className='text-muted-foreground line-clamp-3 text-sm'>
                    {exercise.instructions || 'Brak instrukcji technicznej.'}
                </p>
            </CardContent>
            <CardFooter className='justify-end'>
                <ExerciseStatusForm
                    exerciseId={exercise.id}
                    status={exercise.status}
                    variant='ghost'
                    className='relative z-10'
                />
            </CardFooter>
        </Tile>
    );
}

function ExerciseCatalogTile({ exercise }: { exercise: ExerciseCatalogListItem }) {
    const libraryExerciseId = exercise.activeLibraryExerciseId;

    return (
        <Tile interactive={Boolean(libraryExerciseId)}>
            <CardHeader>
                <CardTitle className='line-clamp-2'>
                    {libraryExerciseId ? (
                        <TileLink href={getExercisePath({ exerciseId: libraryExerciseId })}>
                            {exercise.name}
                        </TileLink>
                    ) : (
                        exercise.name
                    )}
                </CardTitle>
            </CardHeader>
            <CardFooter className='mt-auto justify-between gap-2'>
                {libraryExerciseId ? (
                    <>
                        <Badge variant='outline'>
                            <CheckIcon />W bibliotece
                        </Badge>
                        <span className='flex items-center gap-1 text-sm font-medium'>
                            Otwórz
                            <ArrowRightIcon className='size-4' />
                        </span>
                    </>
                ) : (
                    <>
                        <span className='text-muted-foreground text-xs'>Dostępne w katalogu</span>
                        <AddExerciseFromCatalogForm
                            sourceExerciseId={exercise.id}
                            className='relative z-10'
                        />
                    </>
                )}
            </CardFooter>
        </Tile>
    );
}

function ExerciseListEmpty({ result }: { result: ExerciseListResult }) {
    const { filters, view } = result;

    if (filters.search) {
        return (
            <Empty className='border'>
                <EmptyHeader>
                    <EmptyMedia variant='icon'>
                        <DumbbellIcon />
                    </EmptyMedia>
                    <EmptyTitle>Nic nie pasuje do „{filters.search}”</EmptyTitle>
                    <EmptyDescription>
                        Spróbuj innej nazwy albo sprawdź pozostałe zakładki.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    if (view === ExerciseListView.Catalog) {
        return (
            <Empty className='border'>
                <EmptyHeader>
                    <EmptyMedia variant='icon'>
                        <BookOpenIcon />
                    </EmptyMedia>
                    <EmptyTitle>Katalog jest pusty</EmptyTitle>
                </EmptyHeader>
            </Empty>
        );
    }

    return (
        <Empty className='border'>
            <EmptyHeader>
                <EmptyMedia variant='icon'>
                    <DumbbellIcon />
                </EmptyMedia>
                <EmptyTitle>
                    {filters.status === ExerciseListStatus.Archived
                        ? 'Brak ćwiczeń w archiwum'
                        : 'Twoja biblioteka jest pusta'}
                </EmptyTitle>
                <EmptyDescription>
                    Dodaj własne ćwiczenie albo skopiuj gotowe z katalogu.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className='flex-row justify-center'>
                <Button render={<Link href={getNewExercisePath()} />} nativeButton={false}>
                    <PlusIcon data-icon='inline-start' />
                    Dodaj własne
                </Button>
                <Button
                    variant='outline'
                    render={
                        <Link
                            href={getExerciseListHref({
                                view: ExerciseListView.Catalog,
                                page: 1,
                                search: '',
                                status: ExerciseListStatus.Active
                            })}
                        />
                    }
                    nativeButton={false}
                >
                    Przejdź do katalogu
                </Button>
            </EmptyContent>
        </Empty>
    );
}

function ExercisePagination({ result }: { result: ExerciseListResult }) {
    const { filters, pagination } = result;

    if (!pagination.hasPreviousPage && !pagination.hasNextPage) {
        return null;
    }

    function getPageHref(page: number) {
        return getExerciseListHref({
            view: result.view,
            page,
            search: filters.search,
            status: filters.status
        });
    }

    return (
        <nav className='flex items-center justify-between gap-2' aria-label='Strony'>
            <span className='text-muted-foreground text-sm'>Strona {pagination.page}</span>
            <div className='flex gap-2'>
                {pagination.hasPreviousPage ? (
                    <Link
                        href={getPageHref(pagination.page - 1)}
                        className={buttonVariants({ variant: 'outline', size: 'sm' })}
                    >
                        Poprzednia
                    </Link>
                ) : (
                    <Button variant='outline' size='sm' disabled>
                        Poprzednia
                    </Button>
                )}
                {pagination.hasNextPage ? (
                    <Link
                        href={getPageHref(pagination.page + 1)}
                        className={buttonVariants({ variant: 'outline', size: 'sm' })}
                    >
                        Następna
                    </Link>
                ) : (
                    <Button variant='outline' size='sm' disabled>
                        Następna
                    </Button>
                )}
            </div>
        </nav>
    );
}

export function ExerciseList({ result }: { result: ExerciseListResult }) {
    const { filters } = result;

    return (
        <div className='flex flex-col gap-4'>
            <ExerciseViewTabs view={result.view} />
            <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                <ExerciseSearch
                    key={result.view}
                    view={result.view}
                    status={filters.status}
                    search={filters.search}
                />
                {result.view === ExerciseListView.Library ? (
                    <ExerciseStatusFilter search={filters.search} status={filters.status} />
                ) : null}
            </div>
            {result.exercises.length === 0 ? (
                <ExerciseListEmpty result={result} />
            ) : result.view === ExerciseListView.Library ? (
                <TileGrid>
                    {result.exercises.map(exercise => (
                        <ExerciseLibraryTile key={exercise.id} exercise={exercise} />
                    ))}
                </TileGrid>
            ) : (
                <TileGrid columns={4}>
                    {result.exercises.map(exercise => (
                        <ExerciseCatalogTile key={exercise.id} exercise={exercise} />
                    ))}
                </TileGrid>
            )}
            <ExercisePagination result={result} />
        </div>
    );
}
