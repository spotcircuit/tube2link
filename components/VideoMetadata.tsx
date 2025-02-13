import { useState } from 'react';
import Image from 'next/image';
import { VideoData } from '@/types/video';

interface VideoMetadataProps {
  videoData: VideoData;
}

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, defaultOpen = false, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
      >
        <span className="text-lg font-medium text-white">{title}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="p-4 bg-white/5">{children}</div>}
    </div>
  );
}

function MetadataField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start space-x-2">
      <span className="text-purple-300 block flex-shrink-0">{label}:</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

function formatDuration(duration: string): string {
  // ISO 8601 duration to readable format
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return duration;
  
  const [, hours, minutes, seconds] = match;
  const parts = [];
  
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds) parts.push(`${seconds}s`);
  
  return parts.join(' ');
}

export default function VideoMetadata({ videoData }: VideoMetadataProps) {
  // Get the best available thumbnail URL
  const thumbnailUrl = videoData.thumbnails?.maxres?.url ||
                      videoData.thumbnails?.high?.url ||
                      videoData.thumbnails?.medium?.url ||
                      videoData.thumbnails?.default?.url ||
                      `https://img.youtube.com/vi/${videoData.videoId}/hqdefault.jpg`;

  return (
    <div className="w-full space-y-6">
      {/* Thumbnail Section */}
      <div className="flex justify-center">
        <div className="relative aspect-video w-full max-w-2xl rounded-xl overflow-hidden">
          <Image
            src={thumbnailUrl}
            alt={`Thumbnail for ${videoData.title || 'YouTube video'}`}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Basic Info Section */}
      <CollapsibleSection title="Video Information" defaultOpen={true}>
        <div className="space-y-4">
          <MetadataField label="Title" value={videoData.title} />
          <MetadataField label="Channel" value={videoData.channelTitle} />
          {videoData.publishedAt && (
            <MetadataField 
              label="Published" 
              value={new Date(videoData.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} 
            />
          )}
          {videoData.duration && (
            <MetadataField 
              label="Duration" 
              value={formatDuration(videoData.duration)} 
            />
          )}
          <MetadataField label="Description" value={videoData.description} />
        </div>
      </CollapsibleSection>

      {/* Tags Section */}
      {videoData.tags && videoData.tags.length > 0 && (
        <CollapsibleSection title="Tags">
          <div className="flex flex-wrap gap-2">
            {videoData.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-500/20 border border-purple-500/40 rounded-full text-sm text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}
