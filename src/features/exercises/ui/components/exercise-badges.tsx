import { Badge } from '@/shared';

import { type ExerciseStatus, isExerciseArchived } from '../../domain/exercise';

export function ExerciseBadges({
    isCustom,
    status
}: {
    isCustom: boolean;
    status: ExerciseStatus;
}) {
    return (
        <span className='flex flex-wrap items-center gap-1.5'>
            <Badge variant={isCustom ? 'default' : 'secondary'}>
                {isCustom ? 'Własne' : 'Z katalogu'}
            </Badge>
            {isExerciseArchived({ status }) ? <Badge variant='outline'>Archiwalne</Badge> : null}
        </span>
    );
}
