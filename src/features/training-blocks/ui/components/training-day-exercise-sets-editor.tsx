'use client';

import { PlusIcon, XIcon } from 'lucide-react';

import { AddTile, Button, Field, FieldError, FieldTitle, Input } from '@/shared';

import {
    type TrainingDayExerciseSet,
    TrainingDayExerciseTargetType
} from '../../domain/training-day-exercise';
import { useTrainingDayExerciseSetRows } from '../hooks/use-training-day-exercise-set-rows';

const rowClassName = 'grid grid-cols-[1.5rem_1fr_1fr_4.5rem_1.75rem] items-center gap-2';

export function TrainingDayExerciseSetsEditor({
    fieldIdPrefix,
    targetType,
    defaultSets,
    errors
}: {
    fieldIdPrefix: string;
    targetType: TrainingDayExerciseTargetType;
    defaultSets?: TrainingDayExerciseSet[];
    errors?: string[];
}) {
    const { rows, canAddRow, addRow, removeRow, updateRow } = useTrainingDayExerciseSetRows({
        defaultSets
    });
    const isDuration = targetType === TrainingDayExerciseTargetType.Duration;
    const titleId = `${fieldIdPrefix}-sets`;

    return (
        <Field data-invalid={Boolean(errors?.length)}>
            <FieldTitle id={titleId}>Serie</FieldTitle>
            <div className='flex flex-col gap-2' role='group' aria-labelledby={titleId}>
                {rows.length ? (
                    <div className={`${rowClassName} text-muted-foreground text-xs`}>
                        <span>Nr</span>
                        <span>{isDuration ? 'Czas pracy (s)' : 'Powtórzenia'}</span>
                        <span>Obciążenie (kg)</span>
                        <span>RIR</span>
                        <span />
                    </div>
                ) : (
                    <p className='text-muted-foreground text-sm'>Brak serii.</p>
                )}
                {rows.map((row, index) => (
                    <div key={row.key} className={rowClassName}>
                        <span className='text-muted-foreground text-sm tabular-nums'>
                            {index + 1}
                        </span>
                        {isDuration ? (
                            <Input
                                name='setDurationSeconds'
                                type='number'
                                min={1}
                                max={86400}
                                inputMode='numeric'
                                required
                                placeholder='45'
                                value={row.durationSeconds}
                                onChange={event =>
                                    updateRow({
                                        key: row.key,
                                        field: 'durationSeconds',
                                        value: event.target.value
                                    })
                                }
                                aria-label={`Seria ${index + 1}: czas pracy w sekundach`}
                            />
                        ) : (
                            <Input
                                name='setReps'
                                maxLength={50}
                                placeholder='8–10'
                                value={row.reps}
                                onChange={event =>
                                    updateRow({
                                        key: row.key,
                                        field: 'reps',
                                        value: event.target.value
                                    })
                                }
                                aria-label={`Seria ${index + 1}: powtórzenia`}
                            />
                        )}
                        <Input
                            name='setLoadKg'
                            type='number'
                            min={0}
                            max={1000}
                            step='any'
                            inputMode='decimal'
                            placeholder='60'
                            value={row.loadKg}
                            onChange={event =>
                                updateRow({
                                    key: row.key,
                                    field: 'loadKg',
                                    value: event.target.value
                                })
                            }
                            aria-label={`Seria ${index + 1}: obciążenie w kilogramach`}
                        />
                        <Input
                            name='setRir'
                            maxLength={50}
                            placeholder='2'
                            value={row.rir}
                            onChange={event =>
                                updateRow({ key: row.key, field: 'rir', value: event.target.value })
                            }
                            aria-label={`Seria ${index + 1}: RIR`}
                        />
                        <Button
                            type='button'
                            variant='ghost'
                            size='icon-sm'
                            aria-label={`Usuń serię ${index + 1}`}
                            onClick={() => removeRow(row.key)}
                        >
                            <XIcon />
                        </Button>
                    </div>
                ))}
                <AddTile
                    className='h-8 min-h-0 flex-row rounded-lg border py-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4'
                    disabled={!canAddRow}
                    onClick={addRow}
                >
                    <PlusIcon />
                    Dodaj serię
                </AddTile>
            </div>
            <FieldError>{errors?.[0]}</FieldError>
        </Field>
    );
}
