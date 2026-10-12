'use client';

import { type FormEvent, useRef, useState } from 'react';

export type WizardStepDefinition = {
    id: string;
    title: string;
    description?: string;
    fields?: readonly string[];
};

type WizardFieldErrors = Partial<Record<string, string[] | undefined>>;

type ValidatableElement = Element & {
    checkValidity: () => boolean;
    reportValidity: () => boolean;
};

function isValidatable(element: Element): element is ValidatableElement {
    return 'checkValidity' in element && 'reportValidity' in element;
}

function findFirstInvalidElement(fieldset: HTMLFieldSetElement) {
    return Array.from(fieldset.elements)
        .filter(isValidatable)
        .find(element => !element.checkValidity());
}

function findFirstStepWithErrors({
    steps,
    fieldErrors
}: {
    steps: readonly WizardStepDefinition[];
    fieldErrors: WizardFieldErrors;
}) {
    return steps.findIndex(step => step.fields?.some(field => fieldErrors[field]?.length));
}

export function useWizard({
    steps,
    fieldErrors
}: {
    steps: readonly WizardStepDefinition[];
    fieldErrors?: WizardFieldErrors;
}) {
    const [currentStep, setCurrentStep] = useState(0);
    const [furthestStep, setFurthestStep] = useState(0);
    const [isStepInvalid, setIsStepInvalid] = useState(false);
    const [trackedFieldErrors, setTrackedFieldErrors] = useState(fieldErrors);
    const stepElements = useRef<(HTMLFieldSetElement | null)[]>([]);
    const lastStep = steps.length - 1;

    if (fieldErrors !== trackedFieldErrors) {
        setTrackedFieldErrors(fieldErrors);
        const errorStep = fieldErrors ? findFirstStepWithErrors({ steps, fieldErrors }) : -1;

        if (errorStep >= 0) {
            setCurrentStep(errorStep);
        }
    }

    function registerStep(index: number) {
        return (element: HTMLFieldSetElement | null) => {
            stepElements.current[index] = element;
        };
    }

    function goToNextStep() {
        const fieldset = stepElements.current[currentStep];
        const invalidElement = fieldset ? findFirstInvalidElement(fieldset) : undefined;

        if (invalidElement) {
            invalidElement.reportValidity();
            setIsStepInvalid(true);
            return;
        }

        const nextStep = Math.min(currentStep + 1, lastStep);
        setIsStepInvalid(false);
        setCurrentStep(nextStep);
        setFurthestStep(step => Math.max(step, nextStep));
    }

    function goToPreviousStep() {
        setIsStepInvalid(false);
        setCurrentStep(step => Math.max(step - 1, 0));
    }

    function goToStep(index: number) {
        if (index <= furthestStep) {
            setIsStepInvalid(false);
            setCurrentStep(index);
        }
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        if (currentStep < lastStep) {
            event.preventDefault();
            goToNextStep();
            return;
        }

        const invalidStep = stepElements.current.findIndex(
            fieldset => fieldset && findFirstInvalidElement(fieldset)
        );

        if (invalidStep < 0) {
            return;
        }

        event.preventDefault();
        setIsStepInvalid(true);
        setCurrentStep(invalidStep);

        const fieldset = stepElements.current[invalidStep];
        if (invalidStep === currentStep && fieldset) {
            findFirstInvalidElement(fieldset)?.reportValidity();
        }
    }

    return {
        currentStep,
        furthestStep,
        isFirstStep: currentStep === 0,
        isLastStep: currentStep === lastStep,
        isStepInvalid,
        registerStep,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        handleSubmit
    };
}
