import 'server-only';

import { createNeonDrizzleDatabase } from '@/shared/server';

import { addExerciseFromCatalogFactory } from './application/use-cases/add-exercise-from-catalog';
import { createExerciseFactory } from './application/use-cases/create-exercise';
import { getExerciseFactory } from './application/use-cases/get-exercise';
import { listCatalogExercisesFactory } from './application/use-cases/list-catalog-exercises';
import { listLibraryExercisesFactory } from './application/use-cases/list-library-exercises';
import { setExerciseStatusFactory } from './application/use-cases/set-exercise-status';
import { updateExerciseFactory } from './application/use-cases/update-exercise';
import { createDrizzleExerciseRepository } from './infrastructure/drizzle/exercise-repository';

const database = createNeonDrizzleDatabase();
const exerciseRepository = createDrizzleExerciseRepository({
    database
});

export const createExercise = createExerciseFactory({ exerciseRepository });
export const addExerciseFromCatalog = addExerciseFromCatalogFactory({ exerciseRepository });
export const getExercise = getExerciseFactory({ exerciseRepository });
export const listCatalogExercises = listCatalogExercisesFactory({ exerciseRepository });
export const listLibraryExercises = listLibraryExercisesFactory({ exerciseRepository });
export const setExerciseStatus = setExerciseStatusFactory({ exerciseRepository });
export const updateExercise = updateExerciseFactory({ exerciseRepository });
