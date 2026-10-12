'use client';

import {
    Field,
    FieldError,
    FieldLabel,
    FieldTitle,
    Input,
    Textarea,
    ToggleGroup,
    ToggleGroupItem
} from '@/shared';

import {
    type TrainingDayExerciseSet,
    TrainingDayExerciseTargetType
} from '../../domain/training-day-exercise';
import { useTrainingDayExerciseTargetType } from '../hooks/use-training-day-exercise-target-type';
import { TrainingDayExerciseSetsEditor } from './training-day-exercise-sets-editor';

export type TrainingDayExerciseFormFieldErrors = {
    targetType?: string[];
    sets?: string[];
    tempo?: string[];
    restSeconds?: string[];
    notes?: string[];
};

export type TrainingDayExerciseFormValues = {
    targetType?: TrainingDayExerciseTargetType;
    sets?: TrainingDayExerciseSet[];
    tempo?: string | null;
    restSeconds?: number | null;
    notes?: string | null;
};

export function TrainingDayExerciseVolumeFields({
    fieldIdPrefix,
    defaultValues = {},
    errors
}: {
    fieldIdPrefix: string;
    defaultValues?: TrainingDayExerciseFormValues;
    errors?: TrainingDayExerciseFormFieldErrors;
}) {
    const { targetType, handleTargetTypeChange } = useTrainingDayExerciseTargetType({
        initialTargetType: defaultValues.targetType
    });

    return (
        <>
            <Field data-invalid={Boolean(errors?.targetType)}>
                <FieldTitle id={`${fieldIdPrefix}-targetType`}>Sposób wykonania</FieldTitle>
                <input type='hidden' name='targetType' value={targetType} />
                <ToggleGroup
                    aria-labelledby={`${fieldIdPrefix}-targetType`}
                    value={[targetType]}
                    onValueChange={handleTargetTypeChange}
                    variant='outline'
                    spacing={0}
                    aria-invalid={Boolean(errors?.targetType)}
                >
                    <ToggleGroupItem
                        type='button'
                        value={TrainingDayExerciseTargetType.Repetitions}
                    >
                        Na powtórzenia
                    </ToggleGroupItem>
                    <ToggleGroupItem type='button' value={TrainingDayExerciseTargetType.Duration}>
                        Na czas
                    </ToggleGroupItem>
                </ToggleGroup>
                <FieldError>{errors?.targetType?.[0]}</FieldError>
            </Field>
            <div className='grid gap-4 sm:grid-cols-2'>
                <Field data-invalid={Boolean(errors?.restSeconds)}>
                    <FieldLabel htmlFor={`${fieldIdPrefix}-restSeconds`}>
                        Przerwa między seriami (s)
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
            </div>
            <TrainingDayExerciseSetsEditor
                fieldIdPrefix={fieldIdPrefix}
                targetType={targetType}
                defaultSets={defaultValues.sets}
                errors={errors?.sets}
            />
        </>
    );
}

export function TrainingDayExerciseNotesField({
    fieldIdPrefix,
    defaultValues = {},
    errors
}: {
    fieldIdPrefix: string;
    defaultValues?: TrainingDayExerciseFormValues;
    errors?: TrainingDayExerciseFormFieldErrors;
}) {
    return (
        <Field data-invalid={Boolean(errors?.notes)}>
            <FieldLabel htmlFor={`${fieldIdPrefix}-notes`}>Notatka trenera</FieldLabel>
            <Textarea
                id={`${fieldIdPrefix}-notes`}
                name='notes'
                rows={3}
                className='min-h-20'
                maxLength={5000}
                placeholder='Dodatkowe wskazówki do wykonania'
                defaultValue={defaultValues.notes ?? ''}
                aria-invalid={Boolean(errors?.notes)}
            />
            <FieldError>{errors?.notes?.[0]}</FieldError>
        </Field>
    );
}
