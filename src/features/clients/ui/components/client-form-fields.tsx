import { Field, FieldError, FieldGroup, FieldLabel, Input } from '@/shared';

export type ClientFormFieldErrors = {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    phone?: string[];
    startedAt?: string[];
};

type ClientFormValues = {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string | null;
    startedAt: string;
};

export function ClientFormFields({
    defaultValues,
    errors
}: {
    defaultValues: ClientFormValues;
    errors?: ClientFormFieldErrors;
}) {
    return (
        <FieldGroup>
            <Field data-invalid={Boolean(errors?.firstName)}>
                <FieldLabel htmlFor='firstName'>Imię</FieldLabel>
                <Input
                    id='firstName'
                    name='firstName'
                    type='text'
                    required
                    maxLength={100}
                    autoComplete='given-name'
                    defaultValue={defaultValues.firstName}
                    aria-invalid={Boolean(errors?.firstName)}
                />
                <FieldError>{errors?.firstName?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors?.lastName)}>
                <FieldLabel htmlFor='lastName'>Nazwisko</FieldLabel>
                <Input
                    id='lastName'
                    name='lastName'
                    type='text'
                    required
                    maxLength={100}
                    autoComplete='family-name'
                    defaultValue={defaultValues.lastName}
                    aria-invalid={Boolean(errors?.lastName)}
                />
                <FieldError>{errors?.lastName?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors?.email)}>
                <FieldLabel htmlFor='email'>E-mail</FieldLabel>
                <Input
                    id='email'
                    name='email'
                    type='email'
                    required
                    maxLength={320}
                    autoComplete='email'
                    defaultValue={defaultValues.email}
                    aria-invalid={Boolean(errors?.email)}
                />
                <FieldError>{errors?.email?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors?.phone)}>
                <FieldLabel htmlFor='phone'>Numer telefonu</FieldLabel>
                <Input
                    id='phone'
                    name='phone'
                    type='tel'
                    maxLength={50}
                    autoComplete='tel'
                    defaultValue={defaultValues.phone ?? ''}
                    aria-invalid={Boolean(errors?.phone)}
                />
                <FieldError>{errors?.phone?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors?.startedAt)}>
                <FieldLabel htmlFor='startedAt'>Początek współpracy</FieldLabel>
                <Input
                    id='startedAt'
                    name='startedAt'
                    type='date'
                    required
                    defaultValue={defaultValues.startedAt}
                    aria-invalid={Boolean(errors?.startedAt)}
                />
                <FieldError>{errors?.startedAt?.[0]}</FieldError>
            </Field>
        </FieldGroup>
    );
}
