'use client';

import {
    ArrowDownIcon,
    ArrowUpIcon,
    EllipsisVerticalIcon,
    Link2Icon,
    PencilIcon,
    Trash2Icon,
    UnlinkIcon
} from 'lucide-react';

import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Spinner
} from '@/shared';

export type ReorderActionsLink = {
    isLinked: boolean;
    canLink: boolean;
    onToggle: () => void;
};

export function ReorderActionsMenu({
    label,
    editLabel,
    deleteLabel,
    isFirst,
    isLast,
    isPending,
    link,
    onEdit,
    onMoveEarlier,
    onMoveLater,
    onDelete
}: {
    label: string;
    editLabel: string;
    deleteLabel: string;
    isFirst: boolean;
    isLast: boolean;
    isPending: boolean;
    link?: ReorderActionsLink;
    onEdit: () => void;
    onMoveEarlier: () => void;
    onMoveLater: () => void;
    onDelete: () => void;
}) {
    return (
        <div className='flex items-center gap-0.5'>
            <Button
                variant='ghost'
                size='icon-sm'
                aria-label='Przenieś wcześniej'
                disabled={isFirst || isPending}
                onClick={onMoveEarlier}
            >
                <ArrowUpIcon />
            </Button>
            <Button
                variant='ghost'
                size='icon-sm'
                aria-label='Przenieś później'
                disabled={isLast || isPending}
                onClick={onMoveLater}
            >
                <ArrowDownIcon />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button
                            variant='ghost'
                            size='icon-sm'
                            aria-label={label}
                            disabled={isPending}
                        />
                    }
                >
                    {isPending ? <Spinner /> : <EllipsisVerticalIcon />}
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='min-w-56'>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={onEdit}>
                            <PencilIcon />
                            {editLabel}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    {link ? (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={link.onToggle}
                                disabled={!link.isLinked && !link.canLink}
                            >
                                {link.isLinked ? <UnlinkIcon /> : <Link2Icon />}
                                {link.isLinked ? 'Rozłącz od poprzedniego' : 'Połącz z poprzednim'}
                            </DropdownMenuItem>
                        </>
                    ) : null}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant='destructive' onClick={onDelete}>
                        <Trash2Icon />
                        {deleteLabel}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
