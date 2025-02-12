import { useState } from 'react';
import { VideoData } from '@/types/video';

interface VideoAnalysisProps {
  videoData: VideoData;
  onUseInPost?: (content: string) => void;
}

interface Section {
  id: string;
  title: string;
  content: string | React.ReactNode;
  defaultCollapsed?: boolean;
}

export function VideoAnalysis({ videoData, onUseInPost }: VideoAnalysisProps) {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'summary': false,
    'core-concepts': true,
    'insights': true,
    'technical': true,
    'practical': true,
  });

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const sections: Section[] = [
    {
      id: 'summary',
      title: 'Summary',
      content: videoData.summary || 'No summary available',
      defaultCollapsed: false
    },
    {
      id: 'core-concepts',
      title: 'Core Concepts',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="text-purple-300 mb-2">Key Points</h4>
            {videoData.keyPoints?.map((point, index) => (
              <div key={index} className="mb-2 flex items-start gap-2">
                <button 
                  onClick={() => onUseInPost?.(point)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Copy
                </button>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'insights',
      title: 'Insights',
      content: (
        <div className="space-y-4">
          {videoData.insights?.map((insight, index) => (
            <div key={index} className="mb-2 flex items-start gap-2">
              <button 
                onClick={() => onUseInPost?.(insight.content)}
                className="text-blue-400 hover:text-blue-300"
              >
                Copy
              </button>
              <div>
                <span className="text-purple-300">{insight.type}: </span>
                <span>{insight.content}</span>
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Video Type Label */}
      <div className="flex items-center gap-2">
        <span className="text-purple-300">Type:</span>
        <span className="px-3 py-1 bg-purple-500/30 border border-purple-500/50 rounded-full text-white">
          {videoData.metadata?.type?.charAt(0).toUpperCase() + videoData.metadata?.type?.slice(1)}
        </span>
      </div>

      {sections.map(section => (
        <div key={section.id} className="bg-black/20 rounded-lg border border-white/10">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5"
          >
            <h3 className="text-lg font-medium text-white">{section.title}</h3>
            <span className="text-purple-400">
              {collapsedSections[section.id] ? '▼' : '▲'}
            </span>
          </button>
          {!collapsedSections[section.id] && (
            <div className="p-4 pt-0">
              {typeof section.content === 'string' ? (
                <div className="text-white">{section.content}</div>
              ) : (
                section.content
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
