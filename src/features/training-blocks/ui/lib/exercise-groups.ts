import {
    groupLinkedExercises,
    type TrainingDayExerciseSection
} from '../../domain/training-day-exercise';
import type { TrainingDayExerciseDetails } from '../queries/get-training-block-details-or-redirect';

const firstLetterCode = 'a'.charCodeAt(0);

export type ExerciseGroupItem = {
    exercise: TrainingDayExerciseDetails;
    label: string;
    restLabel: string;
    isFirst: boolean;
    isLast: boolean;
    canLinkToPrevious: boolean;
    isLinkedToNext: boolean;
};

export type ExerciseGroup = {
    id: string;
    isLinked: boolean;
    isFirst: boolean;
    isLast: boolean;
    items: ExerciseGroupItem[];
};

function getLinkedExerciseLabel({ groupNumber, index }: { groupNumber: number; index: number }) {
    return `${groupNumber}${String.fromCharCode(firstLetterCode + index)}`;
}

function toStandaloneItem({
    exercise,
    groupNumber,
    isFirstGroup,
    isLastGroup
}: {
    exercise: TrainingDayExerciseDetails;
    groupNumber: number;
    isFirstGroup: boolean;
    isLastGroup: boolean;
}): ExerciseGroupItem {
    return {
        exercise,
        label: String(groupNumber),
        restLabel: 'Przerwa',
        isFirst: isFirstGroup,
        isLast: isLastGroup,
        canLinkToPrevious: !isFirstGroup,
        isLinkedToNext: false
    };
}

function toLinkedItem({
    exercise,
    index,
    exerciseCount,
    groupNumber,
    isFirstGroup
}: {
    exercise: TrainingDayExerciseDetails;
    index: number;
    exerciseCount: number;
    groupNumber: number;
    isFirstGroup: boolean;
}): ExerciseGroupItem {
    const isFirst = index === 0;
    const isLast = index === exerciseCount - 1;

    return {
        exercise,
        label: getLinkedExerciseLabel({ groupNumber, index }),
        restLabel: isLast ? 'Przerwa po rundzie' : 'Przerwa przed kolejnym',
        isFirst,
        isLast,
        canLinkToPrevious: isFirst && !isFirstGroup,
        isLinkedToNext: !isLast
    };
}

function toExerciseGroup({
    exercises,
    index,
    groupCount
}: {
    exercises: TrainingDayExerciseDetails[];
    index: number;
    groupCount: number;
}): ExerciseGroup {
    const [firstExercise] = exercises;
    const groupNumber = index + 1;
    const isFirstGroup = index === 0;
    const isLastGroup = index === groupCount - 1;
    const isLinked = exercises.length > 1;

    return {
        id: firstExercise.id,
        isLinked,
        isFirst: isFirstGroup,
        isLast: isLastGroup,
        items: isLinked
            ? exercises.map((exercise, exerciseIndex) =>
                  toLinkedItem({
                      exercise,
                      index: exerciseIndex,
                      exerciseCount: exercises.length,
                      groupNumber,
                      isFirstGroup
                  })
              )
            : [
                  toStandaloneItem({
                      exercise: firstExercise,
                      groupNumber,
                      isFirstGroup,
                      isLastGroup
                  })
              ]
    };
}

export function getSectionExerciseGroups({
    exercises,
    section
}: {
    exercises: TrainingDayExerciseDetails[];
    section: TrainingDayExerciseSection;
}) {
    const sectionExercises = exercises.filter(exercise => exercise.section === section);
    const linkedExercises = groupLinkedExercises(sectionExercises);

    return {
        exerciseCount: sectionExercises.length,
        groups: linkedExercises.map((groupExercises, index) =>
            toExerciseGroup({
                exercises: groupExercises,
                index,
                groupCount: linkedExercises.length
            })
        )
    };
}
