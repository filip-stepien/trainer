import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    Input,
    Textarea,
    formatDateForDisplay
} from '@/shared';

export type TrainingBlockFormFieldErrors = {
    name?: string[];
    description?: string[];
    durationWeeks?: string[];
    startDate?: string[];
};

type TrainingBlockFormValues = {
    name?: string;
    description?: string | null;
    durationWeeks?: number | null;
    startDate?: string;
};

export function TrainingBlockBasicsFields({
    defaultValues = {},
    errors
}: {
    defaultValues?: TrainingBlockFormValues;
    errors?: TrainingBlockFormFieldErrors;
}) {
    return (
        <FieldGroup>
            <Field data-invalid={Boolean(errors?.name)}>
                <FieldLabel htmlFor='name'>Nazwa bloku</FieldLabel>
                <Input
                    id='name'
                    name='name'
                    type='text'
                    required
                    maxLength={150}
                    placeholder='Np. Budowanie siły — etap 1'
                    defaultValue={defaultValues.name}
                    aria-invalid={Boolean(errors?.name)}
                />
                <FieldError>{errors?.name?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors?.startDate)}>
                <FieldLabel htmlFor='startDate'>Data rozpoczęcia</FieldLabel>
                <Input
                    id='startDate'
                    name='startDate'
                    type='date'
                    required
                    defaultValue={defaultValues.startDate}
                    aria-invalid={Boolean(errors?.startDate)}
                />
                <FieldError>{errors?.startDate?.[0]}</FieldError>
            </Field>
        </FieldGroup>
    );
}

export function TrainingBlockPlanFields({
    defaultValues = {},
    errors,
    estimatedEndDate
}: {
    defaultValues?: TrainingBlockFormValues;
    errors?: TrainingBlockFormFieldErrors;
    estimatedEndDate: string | null;
}) {
    return (
        <FieldGroup>
            <Field data-invalid={Boolean(errors?.durationWeeks)}>
                <FieldLabel htmlFor='durationWeeks'>Planowana liczba tygodni</FieldLabel>
                <Input
                    id='durationWeeks'
                    name='durationWeeks'
                    type='number'
                    min={1}
                    max={104}
                    inputMode='numeric'
                    placeholder='Opcjonalnie, np. 8'
                    defaultValue={defaultValues.durationWeeks ?? ''}
                    aria-invalid={Boolean(errors?.durationWeeks)}
                />
                {estimatedEndDate ? (
                    <FieldDescription>
                        Szacowany koniec: {formatDateForDisplay({ date: estimatedEndDate })}
                    </FieldDescription>
                ) : null}
                <FieldError>{errors?.durationWeeks?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors?.description)}>
                <FieldLabel htmlFor='description'>Cel i założenia</FieldLabel>
                <Textarea
                    id='description'
                    name='description'
                    rows={5}
                    maxLength={5000}
                    placeholder='Opcjonalnie: czemu służy ten blok i na czym się skupia'
                    defaultValue={defaultValues.description ?? ''}
                    aria-invalid={Boolean(errors?.description)}
                />
                <FieldError>{errors?.description?.[0]}</FieldError>
            </Field>
        </FieldGroup>
    );
}
