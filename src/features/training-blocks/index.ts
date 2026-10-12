export type {
    TrainingBlock,
    TrainingBlockStatus as TrainingBlockStatusValue,
    TrainingBlockVersion
} from './domain/training-block';
export { TrainingBlockStatus } from './domain/training-block';
export { EditTrainingBlockDialog } from './ui/components/edit-training-block-dialog';
export { TrainingBlockEditor } from './ui/components/training-block-editor';
export { TrainingBlockList } from './ui/components/training-block-list';
export { TrainingBlockMeta } from './ui/components/training-block-meta';
export { TrainingBlockStatusBadge } from './ui/components/training-block-status-badge';
export { getTrainingBlockPath, isTrainingBlockSectionPath } from './ui/lib/routes';
