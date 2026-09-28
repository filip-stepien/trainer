import { Field, FieldError, FieldGroup, FieldLabel, Input, Textarea } from '@/shared';

export type TrainingDayFormFieldErrors = {
    name?: string[];
    description?: string[];
};

type TrainingDayFormValues = {
    name?: string;
    description?: string | null;
};

export function TrainingDayFormFields({
    fieldIdPrefix,
    defaultValues = {},
    errors,
    autoFocus = false
}: {
    fieldIdPrefix: string;
    defaultValues?: TrainingDayFormValues;
    errors?: TrainingDayFormFieldErrors;
    autoFocus?: boolean;
}) {
    const nameId = `${fieldIdPrefix}-name`;
    const descriptionId = `${fieldIdPrefix}-description`;

    return (
        <FieldGroup>
            <Field data-invalid={Boolean(errors?.name)}>
                <FieldLabel htmlFor={nameId}>Nazwa dnia</FieldLabel>
                <Input
                    id={nameId}
                    name='name'
                    type='text'
                    required
                    maxLength={150}
                    autoFocus={autoFocus}
                    placeholder='Np. Trening A — góra ciała'
                    defaultValue={defaultValues.name}
                    aria-invalid={Boolean(errors?.name)}
                />
                <FieldError>{errors?.name?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors?.description)}>
                <FieldLabel htmlFor={descriptionId}>Cel lub opis</FieldLabel>
                <Textarea
                    id={descriptionId}
                    name='description'
                    rows={3}
                    maxLength={5000}
                    defaultValue={defaultValues.description ?? ''}
                    aria-invalid={Boolean(errors?.description)}
                />
                <FieldError>{errors?.description?.[0]}</FieldError>
            </Field>
        </FieldGroup>
    );
}
