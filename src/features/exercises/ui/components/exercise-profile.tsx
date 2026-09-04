import Link from 'next/link';
import { ArrowLeftIcon, ExternalLinkIcon } from 'lucide-react';

import {
    Badge,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    buttonVariants
} from '@/shared';

import { ExerciseStatus } from '../../domain/exercise';
import { getExerciseListPath } from '../lib/routes';
import type { ExerciseDetails } from '../queries/get-exercise-details-or-redirect';
import { ExerciseStatusForm } from './exercise-status-form';

export function ExerciseProfile({ exercise }: { exercise: ExerciseDetails }) {
    const archived = exercise.status === ExerciseStatus.Archived;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{exercise.name}</CardTitle>
                <CardDescription>
                    {exercise.isCustom
                        ? 'Własna definicja ćwiczenia.'
                        : 'Edytowalna kopia ćwiczenia dodanego z katalogu.'}
                </CardDescription>
                <CardAction className='flex items-center gap-2'>
                    <Badge variant={exercise.isCustom ? 'default' : 'secondary'}>
                        {exercise.isCustom ? 'Własne' : 'Z katalogu'}
                    </Badge>
                    <Badge variant={archived ? 'secondary' : 'outline'}>
                        {archived ? 'Archiwalne' : 'Aktywne'}
                    </Badge>
                    <ExerciseStatusForm exerciseId={exercise.id} status={exercise.status} />
                </CardAction>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
                <Link
                    href={getExerciseListPath()}
                    className={buttonVariants({ variant: 'ghost', className: 'self-start' })}
                >
                    <ArrowLeftIcon data-icon='inline-start' />
                    Wróć do biblioteki
                </Link>
                {exercise.videoUrl ? (
                    <a
                        href={exercise.videoUrl}
                        target='_blank'
                        rel='noreferrer'
                        className={buttonVariants({
                            variant: 'outline',
                            className: 'self-start'
                        })}
                    >
                        Otwórz film instruktażowy
                        <ExternalLinkIcon data-icon='inline-end' />
                    </a>
                ) : null}
            </CardContent>
        </Card>
    );
}
