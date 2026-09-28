import { Badge } from '@/shared';

import {
    TrainingBlockStatus,
    type TrainingBlockStatus as TrainingBlockStatusValue
} from '../../domain/training-block';

const statusLabels: Record<TrainingBlockStatusValue, string> = {
    [TrainingBlockStatus.Draft]: 'Szkic',
    [TrainingBlockStatus.Active]: 'Aktywny',
    [TrainingBlockStatus.Completed]: 'Zakończony'
};

export function TrainingBlockStatusBadge({ status }: { status: TrainingBlockStatusValue }) {
    return (
        <Badge variant={status === TrainingBlockStatus.Active ? 'default' : 'secondary'}>
            {statusLabels[status]}
        </Badge>
    );
}
