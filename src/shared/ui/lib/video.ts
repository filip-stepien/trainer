const youTubeVideoIdPattern = /^[\w-]{11}$/;

const youTubeHostPrefixPattern = /^(www|m|music)\./;

const youTubeHosts = ['youtube.com', 'youtube-nocookie.com'];

const youTubeShortLinkHost = 'youtu.be';

const youTubeVideoPathPrefixes = ['embed', 'shorts', 'live'];

function parseUrl({ url }: { url: string }) {
    try {
        return new URL(url);
    } catch {
        return null;
    }
}

function findYouTubeVideoId({ url }: { url: URL }) {
    const host = url.hostname.replace(youTubeHostPrefixPattern, '');
    const [firstSegment, secondSegment] = url.pathname.split('/').filter(Boolean);

    if (host === youTubeShortLinkHost) {
        return firstSegment;
    }

    if (!youTubeHosts.includes(host)) {
        return null;
    }

    if (firstSegment === 'watch') {
        return url.searchParams.get('v');
    }

    return youTubeVideoPathPrefixes.includes(firstSegment) ? secondSegment : null;
}

export function getYouTubeVideoId({ url }: { url: string }) {
    const parsedUrl = parseUrl({ url });
    const videoId = parsedUrl ? findYouTubeVideoId({ url: parsedUrl }) : null;

    return videoId && youTubeVideoIdPattern.test(videoId) ? videoId : null;
}
