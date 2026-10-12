import 'server-only';

import { createNeonDrizzleDatabase } from '@/shared/server';

import { createTrainingBlockFactory } from './application/use-cases/create-training-block';
import { createTrainingDayFactory } from './application/use-cases/create-training-day';
import { addTrainingDayExerciseFactory } from './application/use-cases/add-training-day-exercise';
import { deleteTrainingDayExerciseFactory } from './application/use-cases/delete-training-day-exercise';
import { deleteTrainingDayFactory } from './application/use-cases/delete-training-day';
import { getTrainingBlockFactory } from './application/use-cases/get-training-block';
import { listTrainingBlocksFactory } from './application/use-cases/list-training-blocks';
import { listExerciseOptionsFactory } from './application/use-cases/list-exercise-options';
import { listTrainingDayExercisesFactory } from './application/use-cases/list-training-day-exercises';
import { listTrainingDaysFactory } from './application/use-cases/list-training-days';
import { moveTrainingDayFactory } from './application/use-cases/move-training-day';
import { moveTrainingDayExerciseFactory } from './application/use-cases/move-training-day-exercise';
import { setTrainingDayExerciseLinkFactory } from './application/use-cases/set-training-day-exercise-link';
import { updateTrainingBlockFactory } from './application/use-cases/update-training-block';
import { updateTrainingDayExerciseFactory } from './application/use-cases/update-training-day-exercise';
import { updateTrainingDayFactory } from './application/use-cases/update-training-day';
import { createDrizzleTrainingBlockRepository } from './infrastructure/drizzle/training-block-repository';
import { createDrizzleTrainingDayExerciseRepository } from './infrastructure/drizzle/training-day-exercise-repository';
import { createDrizzleTrainingDayRepository } from './infrastructure/drizzle/training-day-repository';
import { createExerciseLibrary } from './infrastructure/exercise-library';

const database = createNeonDrizzleDatabase();
const trainingBlockRepository = createDrizzleTrainingBlockRepository({ database });
const trainingDayRepository = createDrizzleTrainingDayRepository({ database });
const trainingDayExerciseRepository = createDrizzleTrainingDayExerciseRepository({ database });
const exerciseLibrary = createExerciseLibrary();

export const createTrainingBlock = createTrainingBlockFactory({ trainingBlockRepository });
export const getTrainingBlock = getTrainingBlockFactory({ trainingBlockRepository });
export const listTrainingBlocks = listTrainingBlocksFactory({ trainingBlockRepository });
export const updateTrainingBlock = updateTrainingBlockFactory({ trainingBlockRepository });
export const createTrainingDay = createTrainingDayFactory({ trainingDayRepository });
export const deleteTrainingDay = deleteTrainingDayFactory({ trainingDayRepository });
export const listTrainingDays = listTrainingDaysFactory({ trainingDayRepository });
export const moveTrainingDay = moveTrainingDayFactory({ trainingDayRepository });
export const updateTrainingDay = updateTrainingDayFactory({ trainingDayRepository });
export const addTrainingDayExercise = addTrainingDayExerciseFactory({
    exerciseLibrary,
    trainingDayExerciseRepository
});
export const deleteTrainingDayExercise = deleteTrainingDayExerciseFactory({
    trainingDayExerciseRepository
});
export const listExerciseOptions = listExerciseOptionsFactory({ exerciseLibrary });
export const listTrainingDayExercises = listTrainingDayExercisesFactory({
    trainingDayExerciseRepository
});
export const moveTrainingDayExercise = moveTrainingDayExerciseFactory({
    trainingDayExerciseRepository
});
export const setTrainingDayExerciseLink = setTrainingDayExerciseLinkFactory({
    trainingDayExerciseRepository
});
export const updateTrainingDayExercise = updateTrainingDayExerciseFactory({
    trainingDayExerciseRepository
});
