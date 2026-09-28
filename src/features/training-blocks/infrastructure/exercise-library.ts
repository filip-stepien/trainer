import 'server-only';

import type { Exercise } from '@/features/exercises';
import { getActiveExercise, listActiveExercises } from '@/features/exercises/server';

import type { ExerciseLibrary, ExerciseSnapshot } from '../application/ports/exercise-library';

function toExerciseSnapshot(exercise: Exercise): ExerciseSnapshot {
    return {
        id: exercise.id,
        name: exercise.name,
        instructions: exercise.instructions,
        videoUrl: exercise.videoUrl
    };
}

export function createExerciseLibrary(): ExerciseLibrary {
    return {
        findActiveById: async data => {
            const exercise = await getActiveExercise(data);

            return exercise ? toExerciseSnapshot(exercise) : null;
        },
        findAllActive: async data => {
            const exercises = await listActiveExercises(data);

            return exercises.map(toExerciseSnapshot);
        }
    };
}
