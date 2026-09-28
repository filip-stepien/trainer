export type {
    TrainingBlock,
    TrainingBlockStatus as TrainingBlockStatusValue,
    TrainingBlockVersion
} from './domain/training-block';
export { TrainingBlockStatus } from './domain/training-block';
export { CreateTrainingBlockForm } from './ui/components/create-training-block-form';
export { EditTrainingBlockForm } from './ui/components/edit-training-block-form';
export { TrainingBlockList } from './ui/components/training-block-list';
export { TrainingBlockProfile } from './ui/components/training-block-profile';
export { TrainingDaysEditor } from './ui/components/training-days-editor';
export { getNewTrainingBlockPath, getTrainingBlockPath } from './ui/lib/routes';
