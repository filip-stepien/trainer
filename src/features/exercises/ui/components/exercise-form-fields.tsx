import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    Input,
    Textarea
} from '@/shared';

export type ExerciseFormFieldErrors = {
    name?: string[];
    instructions?: string[];
    videoUrl?: string[];
};

type ExerciseFormValues = {
    name?: string;
    instructions?: string | null;
    videoUrl?: string | null;
};

export function ExerciseFormFields({
    defaultValues = {},
    errors
}: {
    defaultValues?: ExerciseFormValues;
    errors?: ExerciseFormFieldErrors;
}) {
    return (
        <FieldGroup>
            <Field data-invalid={Boolean(errors?.name)}>
                <FieldLabel htmlFor='name'>Nazwa</FieldLabel>
                <Input
                    id='name'
                    name='name'
                    type='text'
                    required
                    maxLength={150}
                    autoFocus
                    defaultValue={defaultValues.name}
                    aria-invalid={Boolean(errors?.name)}
                />
                <FieldError>{errors?.name?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors?.instructions)}>
                <FieldLabel htmlFor='instructions'>Instrukcja techniczna</FieldLabel>
                <Textarea
                    id='instructions'
                    name='instructions'
                    rows={7}
                    maxLength={5000}
                    defaultValue={defaultValues.instructions ?? ''}
                    aria-invalid={Boolean(errors?.instructions)}
                />
                <FieldDescription>
                    Stałe wskazówki widoczne dla podopiecznego, gdy ćwiczenie trafi do planu.
                </FieldDescription>
                <FieldError>{errors?.instructions?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors?.videoUrl)}>
                <FieldLabel htmlFor='videoUrl'>Link do filmu</FieldLabel>
                <Input
                    id='videoUrl'
                    name='videoUrl'
                    type='url'
                    maxLength={2048}
                    placeholder='https://…'
                    defaultValue={defaultValues.videoUrl ?? ''}
                    aria-invalid={Boolean(errors?.videoUrl)}
                />
                <FieldError>{errors?.videoUrl?.[0]}</FieldError>
            </Field>
        </FieldGroup>
    );
}
