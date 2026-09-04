import 'server-only';

import { getAuthenticatedUserOrRedirect } from '@/features/auth/server';

import { getExercise } from '../../composition';
import type { Exercise } from '../../domain/exercise';
import { redirectToExerciseList } from '../lib/navigation';
import { validateExerciseId } from '../lib/validation';

export type ExerciseDetails = Pick<
    Exercise,
    'id' | 'sourceExerciseId' | 'isCustom' | 'name' | 'instructions' | 'videoUrl' | 'status'
>;

function toExerciseDetails(exercise: Exercise): ExerciseDetails {
    return {
        id: exercise.id,
        sourceExerciseId: exercise.sourceExerciseId,
        isCustom: exercise.isCustom,
        name: exercise.name,
        instructions: exercise.instructions,
        videoUrl: exercise.videoUrl,
        status: exercise.status
    };
}

export async function getExerciseDetailsOrRedirect({ exerciseId }: { exerciseId: string }) {
    const user = await getAuthenticatedUserOrRedirect();
    const validation = validateExerciseId({ exerciseId });

    if (!validation.ok) {
        redirectToExerciseList();
    }

    const result = await getExercise({ coachId: user.id, exerciseId: validation.data });

    if (!result.ok) {
        redirectToExerciseList();
    }

    return toExerciseDetails(result.value);
}
