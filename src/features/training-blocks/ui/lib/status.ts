import { TrainingBlockStatus } from '../../domain/training-block';

const trainingBlockStatusSections: TrainingBlockStatusSection[] = [
    { status: TrainingBlockStatus.Active, title: 'Aktywne', emptyLabel: 'Brak aktywnych bloków.' },
    { status: TrainingBlockStatus.Draft, title: 'Szkice', emptyLabel: 'Brak szkiców.' },
    {
        status: TrainingBlockStatus.Completed,
        title: 'Zakończone',
        emptyLabel: 'Brak zakończonych bloków.'
    }
];

type TrainingBlockStatusSection = {
    status: TrainingBlockStatus;
    title: string;
    emptyLabel: string;
};

export type TrainingBlockStatusGroup<Item> = TrainingBlockStatusSection & {
    trainingBlocks: Item[];
};

export function groupTrainingBlocksByStatus<Item extends { status: TrainingBlockStatus }>({
    trainingBlocks
}: {
    trainingBlocks: Item[];
}) {
    function toStatusGroup(section: TrainingBlockStatusSection): TrainingBlockStatusGroup<Item> {
        return {
            ...section,
            trainingBlocks: trainingBlocks.filter(
                trainingBlock => trainingBlock.status === section.status
            )
        };
    }

    return trainingBlockStatusSections.map(toStatusGroup);
}
