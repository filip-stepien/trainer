'use client';

import Link from 'next/link';

import {
    Button,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    FieldError,
    WizardNavigation,
    WizardStep,
    WizardSteps,
    type WizardStepDefinition
} from '@/shared';
import { useWizard } from '@/shared/client';

import { useCreateClient } from '../hooks/use-create-client';
import { getClientListPath } from '../lib/routes';
import { ClientContactFields, ClientPersonalFields } from './client-form-fields';

const createClientSteps = [
    {
        id: 'personal',
        title: 'Dane podopiecznego',
        description: 'Kogo prowadzisz oraz od kiedy i do kiedy trwa współpraca.',
        fields: ['firstName', 'lastName', 'startedAt', 'endsAt']
    },
    {
        id: 'contact',
        title: 'Kontakt',
        description: 'Adres e-mail jest wymagany, telefon możesz dodać później.',
        fields: ['email', 'phone']
    }
] as const satisfies readonly WizardStepDefinition[];

export function CreateClientForm({ startedAt }: { startedAt: string }) {
    const { state, formAction, isPending } = useCreateClient();
    const wizard = useWizard({ steps: createClientSteps, fieldErrors: state.fieldErrors });

    return (
        <Card>
            <CardHeader className='border-b'>
                <WizardSteps
                    steps={createClientSteps}
                    currentStep={wizard.currentStep}
                    furthestStep={wizard.furthestStep}
                    onStepSelect={wizard.goToStep}
                />
            </CardHeader>
            <form
                action={formAction}
                onSubmit={wizard.handleSubmit}
                noValidate
                className='flex flex-col gap-4'
            >
                <CardContent className='flex flex-col gap-6'>
                    <WizardStep
                        ref={wizard.registerStep(0)}
                        step={createClientSteps[0]}
                        isActive={wizard.currentStep === 0}
                        isInvalid={wizard.isStepInvalid}
                    >
                        <ClientPersonalFields
                            defaultValues={{ startedAt }}
                            errors={state.fieldErrors}
                        />
                    </WizardStep>
                    <WizardStep
                        ref={wizard.registerStep(1)}
                        step={createClientSteps[1]}
                        isActive={wizard.currentStep === 1}
                        isInvalid={wizard.isStepInvalid}
                    >
                        <ClientContactFields
                            defaultValues={{ startedAt }}
                            errors={state.fieldErrors}
                        />
                    </WizardStep>
                    {state.error ? <FieldError>{state.error}</FieldError> : null}
                </CardContent>
                <CardFooter>
                    <WizardNavigation
                        isFirstStep={wizard.isFirstStep}
                        isLastStep={wizard.isLastStep}
                        isPending={isPending}
                        submitLabel='Dodaj podopiecznego'
                        pendingLabel='Dodawanie…'
                        onPreviousStep={wizard.goToPreviousStep}
                        onNextStep={wizard.goToNextStep}
                        cancel={
                            <Button
                                variant='ghost'
                                render={<Link href={getClientListPath()} />}
                                nativeButton={false}
                            >
                                Anuluj
                            </Button>
                        }
                    />
                </CardFooter>
            </form>
        </Card>
    );
}
