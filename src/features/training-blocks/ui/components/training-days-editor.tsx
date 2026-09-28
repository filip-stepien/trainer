import { CalendarDaysIcon } from 'lucide-react';

import {
    Card,
    CardContent,
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from '@/shared';

import type { TrainingBlockDetails } from '../queries/get-training-block-details-or-redirect';
import { CreateTrainingDayForm } from './create-training-day-form';
import { TrainingDayCard } from './training-day-card';

export function TrainingDaysEditor({ trainingBlock }: { trainingBlock: TrainingBlockDetails }) {
    const trainingDays = trainingBlock.trainingDays;

    return (
        <section className='flex flex-col gap-4' aria-labelledby='training-days-title'>
            <div className='flex flex-col gap-1'>
                <h2 id='training-days-title' className='text-xl font-semibold tracking-tight'>
                    Dni treningowe
                </h2>
                <p className='text-muted-foreground text-sm'>
                    Ułóż kolejność treningów. Rozgrzewkę i część główną dodasz jako ćwiczenia.
                </p>
            </div>

            {trainingDays.length ? (
                <div className='flex flex-col gap-4'>
                    {trainingDays.map((trainingDay, index) => (
                        <TrainingDayCard
                            key={trainingDay.id}
                            trainingBlockId={trainingBlock.id}
                            trainingDay={trainingDay}
                            number={index + 1}
                            isFirst={index === 0}
                            isLast={index === trainingDays.length - 1}
                            exerciseOptions={trainingBlock.exerciseOptions}
                        />
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent>
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant='icon'>
                                    <CalendarDaysIcon />
                                </EmptyMedia>
                                <EmptyTitle>Brak dni treningowych</EmptyTitle>
                                <EmptyDescription>
                                    Dodaj pierwszy dzień, aby zacząć układać zawartość bloku.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    </CardContent>
                </Card>
            )}

            <CreateTrainingDayForm trainingBlockId={trainingBlock.id} />
        </section>
    );
}
