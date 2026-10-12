'use client';

import { type ReactNode, type Ref, useId } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from 'lucide-react';

import { Button } from '@/shared/ui/components/button';
import { Spinner } from '@/shared/ui/components/spinner';
import type { WizardStepDefinition } from '@/shared/ui/hooks/use-wizard';
import { cn } from '@/shared/ui/lib/utils';

type WizardStepStatus = 'complete' | 'current' | 'upcoming';

function getStepStatus({ index, currentStep }: { index: number; currentStep: number }) {
    if (index < currentStep) {
        return 'complete';
    }

    return index === currentStep ? 'current' : 'upcoming';
}

function WizardStepMarker({ index, status }: { index: number; status: WizardStepStatus }) {
    return (
        <span
            className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors',
                status === 'complete' && 'border-primary bg-primary text-primary-foreground',
                status === 'current' && 'border-primary text-foreground ring-primary/15 ring-4',
                status === 'upcoming' && 'text-muted-foreground'
            )}
        >
            {status === 'complete' ? <CheckIcon className='size-4' /> : index + 1}
        </span>
    );
}

export function WizardSteps({
    steps,
    currentStep,
    furthestStep,
    onStepSelect
}: {
    steps: readonly WizardStepDefinition[];
    currentStep: number;
    furthestStep: number;
    onStepSelect: (index: number) => void;
}) {
    return (
        <ol className='flex items-center gap-2' aria-label='Kroki'>
            {steps.map((step, index) => {
                const status = getStepStatus({ index, currentStep });

                return (
                    <li
                        key={step.id}
                        className='flex flex-1 items-center gap-2 last:flex-none'
                        aria-current={status === 'current' ? 'step' : undefined}
                    >
                        <button
                            type='button'
                            onClick={() => onStepSelect(index)}
                            disabled={index > furthestStep}
                            className='focus-visible:ring-ring/50 flex items-center gap-3 rounded-lg text-left outline-none focus-visible:ring-3 disabled:cursor-default'
                        >
                            <WizardStepMarker index={index} status={status} />
                            <span
                                className={cn(
                                    'hidden text-sm font-medium md:block',
                                    status === 'upcoming' && 'text-muted-foreground'
                                )}
                            >
                                {step.title}
                            </span>
                        </button>
                        {index < steps.length - 1 ? (
                            <span
                                aria-hidden='true'
                                className={cn(
                                    'h-px min-w-4 flex-1',
                                    index < currentStep ? 'bg-primary' : 'bg-border'
                                )}
                            />
                        ) : null}
                    </li>
                );
            })}
        </ol>
    );
}

export function WizardStep({
    ref,
    step,
    isActive,
    isInvalid,
    children
}: {
    ref: Ref<HTMLFieldSetElement>;
    step: WizardStepDefinition;
    isActive: boolean;
    isInvalid: boolean;
    children: ReactNode;
}) {
    const titleId = useId();

    return (
        <fieldset
            ref={ref}
            hidden={!isActive}
            aria-labelledby={titleId}
            className='flex min-w-0 flex-col gap-6'
        >
            <div className='flex flex-col gap-1'>
                <h2 id={titleId} className='text-lg font-semibold tracking-tight'>
                    {step.title}
                </h2>
                {step.description ? (
                    <p className='text-muted-foreground text-sm'>{step.description}</p>
                ) : null}
            </div>
            {children}
            {isInvalid ? (
                <p className='text-destructive text-sm' role='alert'>
                    Uzupełnij wymagane pola, aby przejść dalej.
                </p>
            ) : null}
        </fieldset>
    );
}

export function WizardNavigation({
    isFirstStep,
    isLastStep,
    isPending,
    submitLabel,
    pendingLabel,
    onPreviousStep,
    onNextStep,
    cancel
}: {
    isFirstStep: boolean;
    isLastStep: boolean;
    isPending: boolean;
    submitLabel: string;
    pendingLabel: string;
    onPreviousStep: () => void;
    onNextStep: () => void;
    cancel?: ReactNode;
}) {
    return (
        <div className='flex w-full flex-wrap items-center justify-between gap-2'>
            <div>
                {isFirstStep ? (
                    cancel
                ) : (
                    <Button type='button' variant='ghost' onClick={onPreviousStep}>
                        <ArrowLeftIcon data-icon='inline-start' />
                        Wstecz
                    </Button>
                )}
            </div>
            {isLastStep ? (
                <Button key='submit' type='submit' disabled={isPending}>
                    {isPending ? (
                        <Spinner data-icon='inline-start' />
                    ) : (
                        <CheckIcon data-icon='inline-start' />
                    )}
                    {isPending ? pendingLabel : submitLabel}
                </Button>
            ) : (
                <Button key='next' type='button' onClick={onNextStep}>
                    Dalej
                    <ArrowRightIcon data-icon='inline-end' />
                </Button>
            )}
        </div>
    );
}
