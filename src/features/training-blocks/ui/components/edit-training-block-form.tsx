'use client';

import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    FieldError,
    Spinner
} from '@/shared';

import { useUpdateTrainingBlock } from '../hooks/use-update-training-block';
import type { TrainingBlockDetails } from '../queries/get-training-block-details-or-redirect';
import { TrainingBlockFormFields } from './training-block-form-fields';

export function EditTrainingBlockForm({ trainingBlock }: { trainingBlock: TrainingBlockDetails }) {
    const { state, formAction, isPending } = useUpdateTrainingBlock();

    return (
        <form action={formAction}>
            <input type='hidden' name='trainingBlockId' value={trainingBlock.id} />
            <Card>
                <CardHeader>
                    <CardTitle>Ustawienia bloku</CardTitle>
                    <CardDescription>
                        Zmieniasz roboczą wersję. Publikowanie wersji dodamy razem z zawartością
                        planu.
                    </CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-5'>
                    <TrainingBlockFormFields
                        defaultValues={trainingBlock}
                        errors={state.fieldErrors}
                    />
                    {state.error ? <FieldError>{state.error}</FieldError> : null}
                    {state.success ? (
                        <p className='text-muted-foreground text-sm' aria-live='polite'>
                            {state.success}
                        </p>
                    ) : null}
                </CardContent>
                <CardFooter className='justify-end'>
                    <Button type='submit' disabled={isPending}>
                        {isPending ? <Spinner data-icon='inline-start' /> : null}
                        {isPending ? 'Zapisywanie…' : 'Zapisz zmiany'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
