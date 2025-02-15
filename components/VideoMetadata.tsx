'use client';

import { useState } from 'react';
import { VideoData } from '@/types/video';
import { formatNumber, formatDuration, formatDate } from '@/lib/formatters';
import { YOUTUBE_CATEGORIES } from '@/lib/constants';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, defaultOpen = false, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 transition-colors"
      >
        <span className="text-lg font-medium text-gray-100">{title}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''} text-gray-400`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="p-4 bg-gray-900">{children}</div>}
    </div>
  );
}

interface VideoMetadataProps {
  videoData: VideoData;
}

export default function VideoMetadata({ videoData }: VideoMetadataProps) {
  if (!videoData) return null;

  const {
    title,
    description,
    channelTitle,
    publishedAt,
    duration,
    metrics,
    category,
    tags,
    thumbnails
  } = videoData;

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        {/* Thumbnail */}
        {thumbnails && (
          <div className="flex justify-center mb-6">
            <img 
              src={thumbnails.maxres?.url || thumbnails.high?.url || thumbnails.medium?.url} 
              alt={title || 'Video thumbnail'}
              className="rounded-lg max-h-96 object-contain w-full"
            />
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-100 mb-2">{title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
          {channelTitle && (
            <div className="flex items-center">
              <span className="font-medium text-gray-400">Channel:</span>
              <span className="ml-2">{channelTitle}</span>
            </div>
          )}
          {category && (
            <div className="flex items-center">
              <span className="font-medium text-gray-400">Category:</span>
              <span className="ml-2">{YOUTUBE_CATEGORIES[category] || category}</span>
            </div>
          )}
          {publishedAt && (
            <div className="flex items-center">
              <span className="font-medium text-gray-400">Published:</span>
              <span className="ml-2">{formatDate(publishedAt)}</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center">
              <span className="font-medium text-gray-400">Duration:</span>
              <span className="ml-2">{formatDuration(duration)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Video Stats */}
        {metrics && (
          <CollapsibleSection title="Video Stats" defaultOpen>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {metrics.viewCount !== undefined && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-400">Views</span>
                  <span className="text-lg text-gray-100">{formatNumber(metrics.viewCount)}</span>
                </div>
              )}
              {metrics.likeCount !== undefined && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-400">Likes</span>
                  <span className="text-lg text-gray-100">{formatNumber(metrics.likeCount)}</span>
                </div>
              )}
              {metrics.commentCount !== undefined && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-400">Comments</span>
                  <span className="text-lg text-gray-100">{formatNumber(metrics.commentCount)}</span>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

        {/* Description */}
        {description && (
          <CollapsibleSection title="Description">
            <div className="prose prose-invert prose-sm max-w-none text-gray-300">
              <p style={{ whiteSpace: 'pre-wrap' }}>{description}</p>
            </div>
          </CollapsibleSection>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <CollapsibleSection title="Tags">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-sm bg-gray-800 text-gray-300 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
}
