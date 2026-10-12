import 'server-only';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';
import { toDateString } from '@/shared';

import type { ExerciseSnapshot } from '../../application/ports/exercise-library';
import {
    getTrainingBlock,
    listExerciseOptions,
    listTrainingDayExercises,
    listTrainingDays
} from '../../composition';
import type {
    TrainingBlock,
    TrainingBlockStatus,
    TrainingBlockVersion
} from '../../domain/training-block';
import type { TrainingDay } from '../../domain/training-day';
import type {
    TrainingDayExercise,
    TrainingDayExerciseSection,
    TrainingDayExerciseSet,
    TrainingDayExerciseTargetType
} from '../../domain/training-day-exercise';
import { redirectToClient, redirectToClientList } from '../lib/navigation';
import { validateTrainingBlockId } from '../lib/validation';

export type TrainingBlockDetails = {
    id: string;
    clientId: string;
    status: TrainingBlockStatus;
    name: string;
    description: string | null;
    durationWeeks: number | null;
    startDate: string;
    createdAt: string;
    exerciseOptions: ExerciseOption[];
    trainingDays: TrainingDayDetails[];
};

export type ExerciseOption = {
    id: string;
    name: string;
};

export type TrainingDayDetails = {
    id: string;
    name: string;
    description: string | null;
    exercises: TrainingDayExerciseDetails[];
};

export type TrainingDayExerciseDetails = {
    id: string;
    exerciseId: string;
    section: TrainingDayExerciseSection;
    isLinkedToPrevious: boolean;
    name: string;
    instructions: string | null;
    videoUrl: string | null;
    targetType: TrainingDayExerciseTargetType;
    sets: TrainingDayExerciseSet[];
    tempo: string | null;
    restSeconds: number | null;
    notes: string | null;
};

function toExerciseOption(exercise: ExerciseSnapshot): ExerciseOption {
    return {
        id: exercise.id,
        name: exercise.name
    };
}

function toTrainingDayExerciseDetails(exercise: TrainingDayExercise): TrainingDayExerciseDetails {
    return {
        id: exercise.id,
        exerciseId: exercise.exerciseId,
        section: exercise.section,
        isLinkedToPrevious: exercise.isLinkedToPrevious,
        name: exercise.name,
        instructions: exercise.instructions,
        videoUrl: exercise.videoUrl,
        targetType: exercise.targetType,
        sets: exercise.sets,
        tempo: exercise.tempo,
        restSeconds: exercise.restSeconds,
        notes: exercise.notes
    };
}

function toTrainingDayDetails({
    trainingDay,
    trainingDayExercises
}: {
    trainingDay: TrainingDay;
    trainingDayExercises: TrainingDayExercise[];
}): TrainingDayDetails {
    return {
        id: trainingDay.id,
        name: trainingDay.name,
        description: trainingDay.description,
        exercises: trainingDayExercises
            .filter(exercise => exercise.trainingDayId === trainingDay.id)
            .map(toTrainingDayExerciseDetails)
    };
}

function toTrainingBlockDetails({
    trainingBlock,
    draftVersion,
    trainingDays,
    trainingDayExercises,
    exerciseOptions
}: {
    trainingBlock: TrainingBlock;
    draftVersion: TrainingBlockVersion;
    trainingDays: TrainingDay[];
    trainingDayExercises: TrainingDayExercise[];
    exerciseOptions: ExerciseSnapshot[];
}): TrainingBlockDetails {
    return {
        id: trainingBlock.id,
        clientId: trainingBlock.clientId,
        status: trainingBlock.status,
        name: draftVersion.name,
        description: draftVersion.description,
        durationWeeks: draftVersion.durationWeeks,
        startDate: trainingBlock.startDate,
        createdAt: toDateString({ date: new Date(trainingBlock.createdAt) }),
        exerciseOptions: exerciseOptions.map(toExerciseOption),
        trainingDays: trainingDays.map(trainingDay =>
            toTrainingDayDetails({ trainingDay, trainingDayExercises })
        )
    };
}

export async function getTrainingBlockDetailsOrRedirect({
    trainingBlockId
}: {
    trainingBlockId: string;
}) {
    const user = await getAuthenticatedUserOrRedirect();
    const validation = validateTrainingBlockId({ trainingBlockId });

    if (!validation.ok) {
        redirectToClientList();
    }

    const result = await getTrainingBlock({
        coachId: user.id,
        trainingBlockId: validation.data
    });

    if (!result.ok) {
        redirectToClientList();
    }

    const draftVersion = result.value.draftVersion;
    if (!draftVersion) {
        redirectToClient({ clientId: result.value.clientId });
    }

    const [trainingDays, trainingDayExercises, exerciseOptions] = await Promise.all([
        listTrainingDays({ coachId: user.id, trainingBlockId: result.value.id }),
        listTrainingDayExercises({ coachId: user.id, trainingBlockId: result.value.id }),
        listExerciseOptions({ coachId: user.id })
    ]);

    return toTrainingBlockDetails({
        trainingBlock: result.value,
        draftVersion,
        trainingDays,
        trainingDayExercises,
        exerciseOptions
    });
}
