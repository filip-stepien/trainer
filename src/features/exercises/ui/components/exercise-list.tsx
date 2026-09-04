import Link from 'next/link';
import { DumbbellIcon, ExternalLinkIcon, PlusIcon, SearchIcon } from 'lucide-react';

import {
    Badge,
    Button,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    Field,
    FieldGroup,
    FieldLabel,
    Input,
    NativeSelect,
    NativeSelectOption,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    buttonVariants
} from '@/shared';

import { ExerciseStatus } from '../../domain/exercise';
import {
    ExerciseListStatus,
    ExerciseListView,
    getExerciseListHref,
    getExerciseListPath,
    getExercisePath,
    getNewExercisePath
} from '../lib/routes';
import type {
    ExerciseCatalogListItem,
    ExerciseLibraryListItem,
    ExerciseListResult
} from '../queries/get-exercise-list-or-redirect';
import { AddExerciseFromCatalogForm } from './add-exercise-from-catalog-form';
import { ExerciseStatusForm } from './exercise-status-form';

export function ExerciseList({ result }: { result: ExerciseListResult }) {
    const { filters, pagination } = result;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Biblioteka ćwiczeń</CardTitle>
                <CardDescription>
                    Zarządzaj własnymi ćwiczeniami lub dodawaj gotowe pozycje z katalogu.
                </CardDescription>
                <CardAction>
                    <Link href={getNewExercisePath()} className={buttonVariants()}>
                        <PlusIcon data-icon='inline-start' />
                        Dodaj własne
                    </Link>
                </CardAction>
            </CardHeader>
            <CardContent>
                <Tabs value={result.view}>
                    <TabsList>
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
                            Katalog
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value={result.view} className='flex flex-col gap-6 pt-4'>
                        <ExerciseFilters result={result} />
                        {result.exercises.length === 0 ? (
                            <ExerciseListEmpty view={result.view} />
                        ) : result.view === ExerciseListView.Library ? (
                            <ExerciseLibraryTable exercises={result.exercises} />
                        ) : (
                            <ExerciseCatalogTable exercises={result.exercises} />
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter className='justify-end gap-2'>
                {pagination.hasPreviousPage ? (
                    <Link
                        href={getExerciseListHref({
                            view: result.view,
                            page: pagination.page - 1,
                            search: filters.search,
                            status: filters.status
                        })}
                        className={buttonVariants({ variant: 'outline', size: 'sm' })}
                    >
                        Poprzednia
                    </Link>
                ) : (
                    <Button type='button' variant='outline' size='sm' disabled>
                        Poprzednia
                    </Button>
                )}
                {pagination.hasNextPage ? (
                    <Link
                        href={getExerciseListHref({
                            view: result.view,
                            page: pagination.page + 1,
                            search: filters.search,
                            status: filters.status
                        })}
                        className={buttonVariants({ variant: 'outline', size: 'sm' })}
                    >
                        Następna
                    </Link>
                ) : (
                    <Button type='button' variant='outline' size='sm' disabled>
                        Następna
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

function ExerciseFilters({ result }: { result: ExerciseListResult }) {
    const { filters } = result;
    const hasFilters =
        filters.search ||
        (result.view === ExerciseListView.Library && filters.status !== ExerciseListStatus.Active);

    return (
        <form action={getExerciseListPath()} className='flex flex-col gap-4 md:flex-row'>
            <input type='hidden' name='view' value={result.view} />
            <FieldGroup className='flex-1 md:flex-row'>
                <Field className='flex-1'>
                    <FieldLabel htmlFor='exercise-search'>Nazwa ćwiczenia</FieldLabel>
                    <Input
                        id='exercise-search'
                        name='search'
                        type='search'
                        maxLength={150}
                        defaultValue={filters.search}
                        placeholder='Np. Barbell squat'
                    />
                </Field>
                {result.view === ExerciseListView.Library ? (
                    <Field className='md:max-w-48'>
                        <FieldLabel htmlFor='exercise-status'>Status</FieldLabel>
                        <NativeSelect
                            id='exercise-status'
                            name='status'
                            defaultValue={filters.status}
                            className='w-full'
                        >
                            <NativeSelectOption value={ExerciseListStatus.Active}>
                                Aktywne
                            </NativeSelectOption>
                            <NativeSelectOption value={ExerciseListStatus.Archived}>
                                Archiwalne
                            </NativeSelectOption>
                            <NativeSelectOption value={ExerciseListStatus.All}>
                                Wszystkie
                            </NativeSelectOption>
                        </NativeSelect>
                    </Field>
                ) : null}
            </FieldGroup>
            <div className='flex items-end gap-2'>
                <Button type='submit' variant='outline'>
                    <SearchIcon data-icon='inline-start' />
                    Filtruj
                </Button>
                {hasFilters ? (
                    <Link
                        href={getExerciseListHref({
                            view: result.view,
                            page: 1,
                            search: '',
                            status: ExerciseListStatus.Active
                        })}
                        className={buttonVariants({ variant: 'ghost' })}
                    >
                        Wyczyść
                    </Link>
                ) : null}
            </div>
        </form>
    );
}

function ExerciseLibraryTable({ exercises }: { exercises: ExerciseLibraryListItem[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Ćwiczenie</TableHead>
                    <TableHead>Źródło</TableHead>
                    <TableHead>Materiały</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Akcje</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {exercises.map(exercise => (
                    <TableRow key={exercise.id}>
                        <TableCell className='max-w-md'>
                            <div className='flex flex-col gap-1'>
                                <Link
                                    href={getExercisePath({ exerciseId: exercise.id })}
                                    className={buttonVariants({ variant: 'link' })}
                                >
                                    {exercise.name}
                                </Link>
                                {exercise.instructions ? (
                                    <span className='text-muted-foreground line-clamp-2 text-sm'>
                                        {exercise.instructions}
                                    </span>
                                ) : null}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant={exercise.isCustom ? 'default' : 'secondary'}>
                                {exercise.isCustom ? 'Własne' : 'Z katalogu'}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            {exercise.videoUrl ? (
                                <a
                                    href={exercise.videoUrl}
                                    target='_blank'
                                    rel='noreferrer'
                                    className={buttonVariants({ variant: 'link', size: 'sm' })}
                                >
                                    Film
                                    <ExternalLinkIcon data-icon='inline-end' />
                                </a>
                            ) : (
                                <span className='text-muted-foreground'>Brak</span>
                            )}
                        </TableCell>
                        <TableCell>
                            <Badge
                                variant={
                                    exercise.status === ExerciseStatus.Archived
                                        ? 'secondary'
                                        : 'outline'
                                }
                            >
                                {exercise.status === ExerciseStatus.Archived
                                    ? 'Archiwalne'
                                    : 'Aktywne'}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className='flex justify-end'>
                                <ExerciseStatusForm
                                    exerciseId={exercise.id}
                                    status={exercise.status}
                                />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function ExerciseCatalogTable({ exercises }: { exercises: ExerciseCatalogListItem[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Ćwiczenie</TableHead>
                    <TableHead>Biblioteka</TableHead>
                    <TableHead className='text-right'>Akcje</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {exercises.map(exercise => {
                    const libraryExercise = exercise.libraryExercise;
                    const added = libraryExercise?.status === ExerciseStatus.Active;

                    return (
                        <TableRow key={exercise.id}>
                            <TableCell className='font-medium'>{exercise.name}</TableCell>
                            <TableCell>
                                <Badge variant={added ? 'outline' : 'secondary'}>
                                    {added ? 'Dodane' : 'Dostępne'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className='flex justify-end'>
                                    {libraryExercise && added ? (
                                        <Link
                                            href={getExercisePath({
                                                exerciseId: libraryExercise.id
                                            })}
                                            className={buttonVariants({
                                                variant: 'outline',
                                                size: 'sm'
                                            })}
                                        >
                                            Edytuj
                                        </Link>
                                    ) : (
                                        <AddExerciseFromCatalogForm
                                            sourceExerciseId={exercise.id}
                                        />
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

function ExerciseListEmpty({ view }: { view: ExerciseListResult['view'] }) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant='icon'>
                    <DumbbellIcon />
                </EmptyMedia>
                <EmptyTitle>Nie znaleziono ćwiczeń</EmptyTitle>
                <EmptyDescription>
                    {view === ExerciseListView.Library
                        ? 'Zmień filtry, dodaj własne ćwiczenie albo wybierz je z katalogu.'
                        : 'Zmień wyszukiwaną frazę, aby zobaczyć inne ćwiczenia z katalogu.'}
                </EmptyDescription>
            </EmptyHeader>
            {view === ExerciseListView.Library ? (
                <EmptyContent className='flex-row'>
                    <Link href={getNewExercisePath()} className={buttonVariants()}>
                        <PlusIcon data-icon='inline-start' />
                        Dodaj własne
                    </Link>
                    <Link
                        href={getExerciseListHref({
                            view: ExerciseListView.Catalog,
                            page: 1,
                            search: '',
                            status: ExerciseListStatus.Active
                        })}
                        className={buttonVariants({ variant: 'outline' })}
                    >
                        Przejdź do katalogu
                    </Link>
                </EmptyContent>
            ) : null}
        </Empty>
    );
}
