'use client';

import Link from 'next/link';
import { DumbbellIcon } from 'lucide-react';

import { getExerciseListPath } from '@/features/exercises';
import {
    Button,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    FieldError,
    FieldGroup,
    SearchField,
    WizardNavigation,
    WizardStep,
    WizardSteps,
    type WizardStepDefinition
} from '@/shared';
import { setReturnPoint, useWizard } from '@/shared/client';

import type { TrainingDayExerciseSection } from '../../domain/training-day-exercise';
import { useAddTrainingDayExercise } from '../hooks/use-add-training-day-exercise';
import { useExerciseOptionSearch } from '../hooks/use-exercise-option-search';
import { trainingDayExerciseSectionLabels } from '../lib/format';
import { getAddTrainingDayExerciseHref } from '../lib/routes';
import type {
    ExerciseOption,
    TrainingDayDetails
} from '../queries/get-training-block-details-or-redirect';
import {
    type TrainingDayExerciseFormFieldErrors,
    TrainingDayExerciseNotesField,
    TrainingDayExerciseVolumeFields
} from './training-day-exercise-prescription-fields';

const addExerciseSteps = [
    {
        id: 'exercise',
        title: 'Ćwiczenie',
        description: 'Wybierz pozycję z aktywnej biblioteki.',
        fields: ['exerciseId', 'section']
    },
    {
        id: 'volume',
        title: 'Serie',
        description: 'Rozpisz kolejne serie, przerwę między nimi i tempo.',
        fields: ['targetType', 'sets', 'restSeconds', 'tempo']
    },
    {
        id: 'notes',
        title: 'Notatka',
        description: 'Opcjonalna — możesz ją pominąć.',
        fields: ['notes']
    }
] as const satisfies readonly WizardStepDefinition[];

function ExerciseLibraryLink({
    returnHref,
    variant,
    children
}: {
    returnHref: string;
    variant: 'default' | 'outline';
    children: string;
}) {
    function rememberReturnPoint() {
        setReturnPoint({
            href: returnHref,
            title: 'Jesteś w trakcie dodawania ćwiczenia',
            description: 'Dodaj tu brakujące ćwiczenie i wróć do bloku, żeby dokończyć.',
            actionLabel: 'Wróć do bloku',
            scopePath: getExerciseListPath()
        });
    }

    return (
        <Button
            variant={variant}
            size={variant === 'outline' ? 'sm' : 'default'}
            render={<Link href={getExerciseListPath()} onClick={rememberReturnPoint} />}
            nativeButton={false}
        >
            {children}
        </Button>
    );
}

function ExercisePicker({
    returnHref,
    exerciseOptions,
    errors
}: {
    returnHref: string;
    exerciseOptions: ExerciseOption[];
    errors?: TrainingDayExerciseFormFieldErrors & { exerciseId?: string[] };
}) {
    const { search, matchingIds, hasMatches, setSearch } = useExerciseOptionSearch({
        exerciseOptions
    });

    return (
        <div className='flex flex-col gap-3'>
            <SearchField
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder='Szukaj w bibliotece'
                aria-label='Szukaj ćwiczenia'
                autoFocus
            />
            <div
                role='radiogroup'
                aria-label='Ćwiczenie'
                className='flex max-h-72 flex-col gap-2 overflow-y-auto p-0.5'
            >
                {exerciseOptions.map(option => (
                    <label
                        key={option.id}
                        hidden={!matchingIds.has(option.id)}
                        className='has-checked:border-primary has-checked:bg-primary/5 hover:bg-muted/50 has-focus-visible:ring-ring/50 flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors has-focus-visible:ring-3'
                    >
                        <input
                            type='radio'
                            name='exerciseId'
                            value={option.id}
                            required
                            className='accent-primary size-4 shrink-0'
                        />
                        <span className='font-medium'>{option.name}</span>
                    </label>
                ))}
                {hasMatches ? null : (
                    <p className='text-muted-foreground py-6 text-center text-sm'>
                        Brak ćwiczeń pasujących do „{search}”.
                    </p>
                )}
            </div>
            <FieldError>{errors?.exerciseId?.[0]}</FieldError>
            <div className='bg-muted/50 flex flex-wrap items-center justify-between gap-3 rounded-lg p-4'>
                <span className='text-muted-foreground text-sm'>Nie ma tu ćwiczenia?</span>
                <ExerciseLibraryLink returnHref={returnHref} variant='outline'>
                    Dodaj je w bibliotece
                </ExerciseLibraryLink>
            </div>
        </div>
    );
}

function AddTrainingDayExerciseForm({
    trainingBlockId,
    trainingDayId,
    section,
    returnHref,
    exerciseOptions,
    onAdded
}: {
    trainingBlockId: string;
    trainingDayId: string;
    section: TrainingDayExerciseSection;
    returnHref: string;
    exerciseOptions: ExerciseOption[];
    onAdded: () => void;
}) {
    const { state, formAction, isPending } = useAddTrainingDayExercise({ onSuccess: onAdded });
    const wizard = useWizard({ steps: addExerciseSteps, fieldErrors: state.fieldErrors });
    const fieldIdPrefix = `new-exercise-${trainingDayId}`;

    return (
        <form
            action={formAction}
            onSubmit={wizard.handleSubmit}
            noValidate
            className='flex flex-col gap-6'
        >
            <input type='hidden' name='trainingBlockId' value={trainingBlockId} />
            <input type='hidden' name='trainingDayId' value={trainingDayId} />
            <input type='hidden' name='section' value={section} />
            <WizardSteps
                steps={addExerciseSteps}
                currentStep={wizard.currentStep}
                furthestStep={wizard.furthestStep}
                onStepSelect={wizard.goToStep}
            />
            <WizardStep
                ref={wizard.registerStep(0)}
                step={addExerciseSteps[0]}
                isActive={wizard.currentStep === 0}
                isInvalid={wizard.isStepInvalid}
            >
                <ExercisePicker
                    returnHref={returnHref}
                    exerciseOptions={exerciseOptions}
                    errors={state.fieldErrors}
                />
            </WizardStep>
            <WizardStep
                ref={wizard.registerStep(1)}
                step={addExerciseSteps[1]}
                isActive={wizard.currentStep === 1}
                isInvalid={wizard.isStepInvalid}
            >
                <FieldGroup>
                    <TrainingDayExerciseVolumeFields
                        fieldIdPrefix={fieldIdPrefix}
                        errors={state.fieldErrors}
                    />
                </FieldGroup>
            </WizardStep>
            <WizardStep
                ref={wizard.registerStep(2)}
                step={addExerciseSteps[2]}
                isActive={wizard.currentStep === 2}
                isInvalid={wizard.isStepInvalid}
            >
                <TrainingDayExerciseNotesField
                    fieldIdPrefix={fieldIdPrefix}
                    errors={state.fieldErrors}
                />
            </WizardStep>
            {state.error ? <FieldError>{state.error}</FieldError> : null}
            <DialogFooter>
                <WizardNavigation
                    isFirstStep={wizard.isFirstStep}
                    isLastStep={wizard.isLastStep}
                    isPending={isPending}
                    submitLabel='Dodaj ćwiczenie'
                    pendingLabel='Dodawanie…'
                    onPreviousStep={wizard.goToPreviousStep}
                    onNextStep={wizard.goToNextStep}
                    cancel={<DialogClose render={<Button variant='ghost' />}>Anuluj</DialogClose>}
                />
            </DialogFooter>
        </form>
    );
}

function EmptyLibraryNotice({ returnHref }: { returnHref: string }) {
    return (
        <Empty className='border'>
            <EmptyHeader>
                <EmptyMedia variant='icon'>
                    <DumbbellIcon />
                </EmptyMedia>
                <EmptyTitle>Biblioteka jest pusta</EmptyTitle>
                <EmptyDescription>
                    Dodaj własne ćwiczenie lub skopiuj je z katalogu, aby użyć go w planie.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <ExerciseLibraryLink returnHref={returnHref} variant='default'>
                    Otwórz bibliotekę ćwiczeń
                </ExerciseLibraryLink>
            </EmptyContent>
        </Empty>
    );
}

export function AddTrainingDayExerciseDialog({
    open,
    onOpenChange,
    trainingBlockId,
    trainingDay,
    section,
    exerciseOptions
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trainingBlockId: string;
    trainingDay: TrainingDayDetails;
    section: TrainingDayExerciseSection;
    exerciseOptions: ExerciseOption[];
}) {
    const returnHref = getAddTrainingDayExerciseHref({
        trainingBlockId,
        trainingDayId: trainingDay.id,
        section
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-xl'>
                <DialogHeader>
                    <DialogTitle>Dodaj ćwiczenie</DialogTitle>
                    <DialogDescription>
                        {trainingDay.name} · {trainingDayExerciseSectionLabels[section]}
                    </DialogDescription>
                </DialogHeader>
                {exerciseOptions.length ? (
                    <AddTrainingDayExerciseForm
                        trainingBlockId={trainingBlockId}
                        trainingDayId={trainingDay.id}
                        section={section}
                        returnHref={returnHref}
                        exerciseOptions={exerciseOptions}
                        onAdded={() => onOpenChange(false)}
                    />
                ) : (
                    <EmptyLibraryNotice returnHref={returnHref} />
                )}
            </DialogContent>
        </Dialog>
    );
}
