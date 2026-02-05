import { VideoResource } from '@/types';

export const videos: VideoResource[] = [
  {
    id: 'vid-1',
    url: 'https://youtu.be/DPgG5oNSUIM',
    title: 'How to Hit a Kick Serve',
    channel: 'Intuitive Tennis',
    primaryCueId: 'sv-6',
    relatedCueIds: ['sv-6', 'sv-3', 'sv-4', 'sv-5', 'sv-9', 'sv-12', 'sv-2'],
  },
  {
    id: 'vid-2',
    url: 'https://youtu.be/11cylnd0bsA?t=10',
    title: 'Tennis Forehand Technique',
    channel: 'MyTennisHQ',
    primaryCueId: 'fh-8',
    relatedCueIds: ['fh-8', 'fh-9', 'fh-10', 'fh-3', 'fh-2', 'fh-11'],
  },
];

export function getVideosForCue(cueId: string): VideoResource[] {
  return videos.filter((v) => v.relatedCueIds.includes(cueId));
}

export function getVideoById(videoId: string): VideoResource | undefined {
  return videos.find((v) => v.id === videoId);
}

export function getYouTubeEmbedUrl(url: string): string {
  // Handle youtu.be/ID and youtube.com/watch?v=ID formats
  let videoId = '';
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  } else if (url.includes('watch?v=')) {
    videoId = url.split('watch?v=')[1]?.split('&')[0] || '';
  }
  // Preserve timestamp if present
  const timeMatch = url.match(/[?&]t=(\d+)/);
  const timeParam = timeMatch ? `&start=${timeMatch[1]}` : '';
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1${timeParam}`;
}
