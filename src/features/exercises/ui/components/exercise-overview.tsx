import { ExternalLinkIcon, FileTextIcon, VideoIcon } from 'lucide-react';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    YouTubeEmbed,
    buttonVariants,
    getYouTubeVideoId
} from '@/shared';

import type { ExerciseDetails } from '../queries/get-exercise-details-or-redirect';

function ExerciseVideo({ name, videoUrl }: { name: string; videoUrl: string }) {
    const youTubeVideoId = getYouTubeVideoId({ url: videoUrl });

    if (!youTubeVideoId) {
        return (
            <a
                href={videoUrl}
                target='_blank'
                rel='noreferrer'
                className={buttonVariants({ variant: 'outline' })}
            >
                Otwórz film instruktażowy
                <ExternalLinkIcon data-icon='inline-end' />
            </a>
        );
    }

    return <YouTubeEmbed videoId={youTubeVideoId} title={`Film instruktażowy: ${name}`} />;
}

export function ExerciseOverview({ exercise }: { exercise: ExerciseDetails }) {
    return (
        <div className='flex flex-col gap-4'>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <FileTextIcon className='size-4' />
                        Instrukcja techniczna
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {exercise.instructions ? (
                        <p className='max-w-3xl text-sm leading-relaxed whitespace-pre-line'>
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
                        <ExerciseVideo name={exercise.name} videoUrl={exercise.videoUrl} />
                    ) : (
                        <p className='text-muted-foreground text-sm'>Nie dodano filmu.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
