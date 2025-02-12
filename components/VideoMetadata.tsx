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

export default function VideoMetadata({ videoData }: VideoMetadataProps) {
  return (
    <div className="w-full space-y-6">
      <div className="flex justify-center">
        <div className="relative aspect-video w-full max-w-2xl rounded-xl overflow-hidden">
          <Image
            src={videoData.thumbnails?.maxres?.url ||
                 videoData.thumbnails?.high?.url ||
                 videoData.thumbnails?.medium?.url || 
                 videoData.thumbnails?.default?.url ||
                 `https://img.youtube.com/vi/${videoData.videoId}/hqdefault.jpg`}
            alt={`Thumbnail for ${videoData.title || 'YouTube video'}`}
            layout="fill"
            objectFit="cover"
            priority={true}
            className="hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-white">{videoData.title}</h2>
      
      {/* Video Info Section */}
      <CollapsibleSection title="Video Information" defaultOpen={true}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-purple-300 block">Channel:</span>
            <span className="text-white">{videoData.channelTitle}</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-purple-300 block flex-shrink-0">Description:</span>
            <span className="text-white break-words overflow-auto max-h-32">{videoData.description}</span>
          </div>
          {videoData.statistics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div className="text-center p-2 bg-white/10 rounded-lg">
                <div className="text-purple-300 text-sm">Views</div>
                <div className="text-white font-medium">{videoData.statistics.viewCount.toLocaleString()}</div>
              </div>
              <div className="text-center p-2 bg-white/10 rounded-lg">
                <div className="text-purple-300 text-sm">Likes</div>
                <div className="text-white font-medium">{videoData.statistics.likeCount.toLocaleString()}</div>
              </div>
              <div className="text-center p-2 bg-white/10 rounded-lg">
                <div className="text-purple-300 text-sm">Comments</div>
                <div className="text-white font-medium">{videoData.statistics.commentCount.toLocaleString()}</div>
              </div>
              <div className="text-center p-2 bg-white/10 rounded-lg">
                <div className="text-purple-300 text-sm">Published</div>
                <div className="text-white font-medium">{new Date(videoData.publishedAt).toLocaleDateString()}</div>
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>
      
      {/* Tags Section */}
      <CollapsibleSection title="Tags">
        {videoData.tags && videoData.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {videoData.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-purple-500/30 border border-purple-500/50 rounded-full text-white text-sm">
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-white/60">No tags available</p>
        )}
      </CollapsibleSection>
    </div>
  );
}
