import { Badge, cn } from '@/shared';

import {
    TrainingBlockStatus,
    type TrainingBlockStatus as TrainingBlockStatusValue
} from '../../domain/training-block';

const statusLabels: Record<TrainingBlockStatusValue, string> = {
    [TrainingBlockStatus.Draft]: 'Szkic',
    [TrainingBlockStatus.Active]: 'Aktywny',
    [TrainingBlockStatus.Completed]: 'Zakończony'
};

const statusClassNames: Record<TrainingBlockStatusValue, string> = {
    [TrainingBlockStatus.Draft]:
        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    [TrainingBlockStatus.Active]:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    [TrainingBlockStatus.Completed]: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
};

export function TrainingBlockStatusBadge({ status }: { status: TrainingBlockStatusValue }) {
    return (
        <Badge variant='secondary' className={cn(statusClassNames[status])}>
            {statusLabels[status]}
        </Badge>
    );
}
