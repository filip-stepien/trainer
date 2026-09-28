'use client';

import { useState } from 'react';

import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    Input,
    Textarea,
    ToggleGroup,
    ToggleGroupItem
} from '@/shared';

import { TrainingDayExerciseTargetType } from '../../domain/training-day-exercise';

export type TrainingDayExerciseFormFieldErrors = {
    sets?: string[];
    targetType?: string[];
    reps?: string[];
    durationSeconds?: string[];
    load?: string[];
    tempo?: string[];
    rir?: string[];
    restSeconds?: string[];
    notes?: string[];
};

export type TrainingDayExerciseFormValues = {
    sets?: number | null;
    targetType?: TrainingDayExerciseTargetType;
    reps?: string | null;
    durationSeconds?: number | null;
    load?: string | null;
    tempo?: string | null;
    rir?: string | null;
    restSeconds?: number | null;
    notes?: string | null;
};

export function TrainingDayExercisePrescriptionFields({
    fieldIdPrefix,
    defaultValues = {},
    errors
}: {
    fieldIdPrefix: string;
    defaultValues?: TrainingDayExerciseFormValues;
    errors?: TrainingDayExerciseFormFieldErrors;
}) {
    const [targetType, setTargetType] = useState(
        defaultValues.targetType ?? TrainingDayExerciseTargetType.Repetitions
    );

    return (
        <FieldGroup className='grid gap-4 sm:grid-cols-2'>
            <Field data-invalid={Boolean(errors?.sets)}>
                <FieldLabel htmlFor={`${fieldIdPrefix}-sets`}>Serie</FieldLabel>
                <Input
                    id={`${fieldIdPrefix}-sets`}
                    name='sets'
                    type='number'
                    min={1}
                    max={100}
                    inputMode='numeric'
                    placeholder='Np. 4'
                    defaultValue={defaultValues.sets ?? ''}
                    aria-invalid={Boolean(errors?.sets)}
                />
                <FieldError>{errors?.sets?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors?.targetType)}>
                <FieldLabel>Sposób wykonania</FieldLabel>
                <input type='hidden' name='targetType' value={targetType} />
                <ToggleGroup
                    value={[targetType]}
                    onValueChange={values => {
                        const value = values[0];
                        if (
                            value === TrainingDayExerciseTargetType.Repetitions ||
                            value === TrainingDayExerciseTargetType.Duration
                        ) {
                            setTargetType(value);
                        }
                    }}
                    variant='outline'
                    aria-invalid={Boolean(errors?.targetType)}
                >
                    <ToggleGroupItem
                        type='button'
                        value={TrainingDayExerciseTargetType.Repetitions}
                    >
                        Powtórzenia
                    </ToggleGroupItem>
                    <ToggleGroupItem type='button' value={TrainingDayExerciseTargetType.Duration}>
                        Czas
                    </ToggleGroupItem>
                </ToggleGroup>
                <FieldError>{errors?.targetType?.[0]}</FieldError>
            </Field>
            {targetType === TrainingDayExerciseTargetType.Repetitions ? (
                <Field data-invalid={Boolean(errors?.reps)}>
                    <FieldLabel htmlFor={`${fieldIdPrefix}-reps`}>Powtórzenia</FieldLabel>
                    <Input
                        id={`${fieldIdPrefix}-reps`}
                        name='reps'
                        maxLength={50}
                        placeholder='Np. 8–10'
                        defaultValue={defaultValues.reps ?? ''}
                        aria-invalid={Boolean(errors?.reps)}
                    />
                    <FieldError>{errors?.reps?.[0]}</FieldError>
                </Field>
            ) : (
                <Field data-invalid={Boolean(errors?.durationSeconds)}>
                    <FieldLabel htmlFor={`${fieldIdPrefix}-durationSeconds`}>
                        Czas pracy w sekundach
                    </FieldLabel>
                    <Input
                        id={`${fieldIdPrefix}-durationSeconds`}
                        name='durationSeconds'
                        type='number'
                        min={1}
                        max={86400}
                        inputMode='numeric'
                        required
                        placeholder='Np. 45'
                        defaultValue={defaultValues.durationSeconds ?? ''}
                        aria-invalid={Boolean(errors?.durationSeconds)}
                    />
                    <FieldError>{errors?.durationSeconds?.[0]}</FieldError>
                </Field>
            )}
            <Field data-invalid={Boolean(errors?.load)}>
                <FieldLabel htmlFor={`${fieldIdPrefix}-load`}>Obciążenie</FieldLabel>
                <Input
                    id={`${fieldIdPrefix}-load`}
                    name='load'
                    maxLength={50}
                    placeholder='Np. 60 kg, masa ciała lub guma czerwona'
                    defaultValue={defaultValues.load ?? ''}
                    aria-invalid={Boolean(errors?.load)}
                />
                <FieldDescription>
                    Zostaw puste, jeśli ćwiczenie nie ma obciążenia.
                </FieldDescription>
                <FieldError>{errors?.load?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors?.tempo)}>
                <FieldLabel htmlFor={`${fieldIdPrefix}-tempo`}>Tempo</FieldLabel>
                <Input
                    id={`${fieldIdPrefix}-tempo`}
                    name='tempo'
                    maxLength={50}
                    placeholder='Np. 3-1-1-0'
                    defaultValue={defaultValues.tempo ?? ''}
                    aria-invalid={Boolean(errors?.tempo)}
                />
                <FieldError>{errors?.tempo?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors?.rir)}>
                <FieldLabel htmlFor={`${fieldIdPrefix}-rir`}>RIR</FieldLabel>
                <Input
                    id={`${fieldIdPrefix}-rir`}
                    name='rir'
                    maxLength={50}
                    placeholder='Np. 2 lub 1–2'
                    defaultValue={defaultValues.rir ?? ''}
                    aria-invalid={Boolean(errors?.rir)}
                />
                <FieldError>{errors?.rir?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors?.restSeconds)}>
                <FieldLabel htmlFor={`${fieldIdPrefix}-restSeconds`}>
                    Przerwa w sekundach
                </FieldLabel>
                <Input
                    id={`${fieldIdPrefix}-restSeconds`}
                    name='restSeconds'
                    type='number'
                    min={0}
                    max={3600}
                    inputMode='numeric'
                    placeholder='Np. 120'
                    defaultValue={defaultValues.restSeconds ?? ''}
                    aria-invalid={Boolean(errors?.restSeconds)}
                />
                <FieldError>{errors?.restSeconds?.[0]}</FieldError>
            </Field>
            <Field className='sm:col-span-2' data-invalid={Boolean(errors?.notes)}>
                <FieldLabel htmlFor={`${fieldIdPrefix}-notes`}>Notatka trenera</FieldLabel>
                <Textarea
                    id={`${fieldIdPrefix}-notes`}
                    name='notes'
                    rows={3}
                    maxLength={5000}
                    placeholder='Dodatkowe wskazówki do wykonania'
                    defaultValue={defaultValues.notes ?? ''}
                    aria-invalid={Boolean(errors?.notes)}
                />
                <FieldError>{errors?.notes?.[0]}</FieldError>
            </Field>
        </FieldGroup>
    );
}
