import { cn } from '@/shared/ui/lib/utils';

export function YouTubeEmbed({
    videoId,
    title,
    className
}: {
    videoId: string;
    title: string;
    className?: string;
}) {
    return (
        <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={title}
            loading='lazy'
            allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            allowFullScreen
            referrerPolicy='strict-origin-when-cross-origin'
            className={cn('aspect-video w-full rounded-lg', className)}
        />
    );
}
