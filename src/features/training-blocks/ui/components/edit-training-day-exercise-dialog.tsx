'use client';

import {
    Button,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    FieldError,
    FieldGroup,
    Spinner
} from '@/shared';

import { useUpdateTrainingDayExercise } from '../hooks/use-update-training-day-exercise';
import type { TrainingDayExerciseDetails } from '../queries/get-training-block-details-or-redirect';
import {
    TrainingDayExerciseNotesField,
    TrainingDayExerciseVolumeFields
} from './training-day-exercise-prescription-fields';

function ExerciseReference({ exercise }: { exercise: TrainingDayExerciseDetails }) {
    if (!exercise.instructions) {
        return null;
    }

    return (
        <p className='bg-muted/50 text-muted-foreground line-clamp-4 rounded-lg p-3 text-sm whitespace-pre-line'>
            {exercise.instructions}
        </p>
    );
}

function EditTrainingDayExerciseForm({
    trainingBlockId,
    trainingDayId,
    exercise,
    onSaved
}: {
    trainingBlockId: string;
    trainingDayId: string;
    exercise: TrainingDayExerciseDetails;
    onSaved: () => void;
}) {
    const { state, formAction, isPending } = useUpdateTrainingDayExercise({ onSuccess: onSaved });
    const fieldIdPrefix = `exercise-${exercise.id}`;

    return (
        <form action={formAction} className='flex flex-col gap-6'>
            <input type='hidden' name='trainingBlockId' value={trainingBlockId} />
            <input type='hidden' name='trainingDayId' value={trainingDayId} />
            <input type='hidden' name='trainingDayExerciseId' value={exercise.id} />
            <ExerciseReference exercise={exercise} />
            <FieldGroup>
                <TrainingDayExerciseVolumeFields
                    fieldIdPrefix={fieldIdPrefix}
                    defaultValues={exercise}
                    errors={state.fieldErrors}
                />
                <TrainingDayExerciseNotesField
                    fieldIdPrefix={fieldIdPrefix}
                    defaultValues={exercise}
                    errors={state.fieldErrors}
                />
            </FieldGroup>
            {state.error ? <FieldError>{state.error}</FieldError> : null}
            <DialogFooter>
                <DialogClose render={<Button variant='outline' />}>Anuluj</DialogClose>
                <Button type='submit' disabled={isPending}>
                    {isPending ? <Spinner data-icon='inline-start' /> : null}
                    {isPending ? 'Zapisywanie…' : 'Zapisz zalecenia'}
                </Button>
            </DialogFooter>
        </form>
    );
}

export function EditTrainingDayExerciseDialog({
    open,
    onOpenChange,
    trainingBlockId,
    trainingDayId,
    exercise
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trainingBlockId: string;
    trainingDayId: string;
    exercise: TrainingDayExerciseDetails;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-xl'>
                <DialogHeader>
                    <DialogTitle>{exercise.name}</DialogTitle>
                    <DialogDescription>
                        Zalecenia wykonania w tym dniu treningowym.
                    </DialogDescription>
                </DialogHeader>
                <EditTrainingDayExerciseForm
                    trainingBlockId={trainingBlockId}
                    trainingDayId={trainingDayId}
                    exercise={exercise}
                    onSaved={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
