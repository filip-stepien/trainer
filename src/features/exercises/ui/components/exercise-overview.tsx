import { ExternalLinkIcon, FileTextIcon, VideoIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, buttonVariants } from '@/shared';

import type { ExerciseDetails } from '../queries/get-exercise-details-or-redirect';

export function ExerciseOverview({ exercise }: { exercise: ExerciseDetails }) {
    return (
        <div className='grid gap-4 lg:grid-cols-3'>
            <Card className='lg:col-span-2'>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <FileTextIcon className='size-4' />
                        Instrukcja techniczna
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {exercise.instructions ? (
                        <p className='text-sm leading-relaxed whitespace-pre-line'>
                            {exercise.instructions}
                        </p>
                    ) : (
                        <p className='text-muted-foreground text-sm'>
                            Brak instrukcji. Dodaj ją w edycji — podopieczny zobaczy ją, gdy
                            ćwiczenie trafi do planu.
                        </p>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <VideoIcon className='size-4' />
                        Materiał wideo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {exercise.videoUrl ? (
                        <a
                            href={exercise.videoUrl}
                            target='_blank'
                            rel='noreferrer'
                            className={buttonVariants({ variant: 'outline' })}
                        >
                            Otwórz film instruktażowy
                            <ExternalLinkIcon data-icon='inline-end' />
                        </a>
                    ) : (
                        <p className='text-muted-foreground text-sm'>Nie dodano filmu.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
