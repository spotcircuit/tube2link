'use client';

import { useState } from 'react';
import { VideoData } from '@/types/video';
import { PostSettings, PostGenerationMode, PersonalityTrait } from '@/types/post';
import { toast } from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';

interface SocialPostGeneratorProps {
  videoData: VideoData;
  onReturn?: () => void;
  onCopy?: () => void;
}

interface GenerateResponse {
  content: string;
  html: string;
}

interface PersonalityTraitConfig {
  trait: PersonalityTrait;
  emoji: string;
  desc: string;
}

const personalityTraits: PersonalityTraitConfig[] = [
  { trait: 'charm', emoji: '✨', desc: 'Engaging and appealing' },
  { trait: 'wit', emoji: '🎯', desc: 'Clever and sharp' },
  { trait: 'humor', emoji: '😄', desc: 'Fun and entertaining' },
  { trait: 'sarcasm', emoji: '😏', desc: 'Ironic and playful' }
];

export default function SocialPostGenerator({ videoData, onReturn, onCopy }: SocialPostGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PostGenerationMode>('question');
  const [postSettings, setPostSettings] = useState<PostSettings>({
    tone: 50, // Default to balanced tone
    length: 'standard',
    personality: {
      charm: 0,
      wit: 0,
      humor: 0,
      sarcasm: 0
    },
    useEmojis: true
  });
  const [generating, setGenerating] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [rawResponse, setRawResponse] = useState<GenerateResponse | null>(null);

  const handleGeneratePost = async () => {
    if (!videoData) {
      toast.error('No video data available');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoData,
          template: selectedTemplate,
          settings: postSettings
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate post');
      }

      setRawResponse(data);
      setEditorContent(data.content);
      setShowEditor(true);
    } catch (error) {
      console.error('Error generating post:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate post');
    } finally {
      setGenerating(false);
    }
  };

  if (showEditor) {
    return (
      <div className="space-y-4">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => {
              setShowEditor(false);
              setEditorContent('');
              setRawResponse(null);
            }}
            className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Templates
          </button>
          <button
            onClick={onReturn}
            className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h18M3 12l6-6M3 12l6 6"/>
            </svg>
            New URL
          </button>
        </div>

        <RichTextEditor
          content={editorContent}
          onCopy={() => {
            navigator.clipboard.writeText(editorContent);
            toast.success('Post copied to clipboard!');
            if (onCopy) onCopy();
          }}
          videoUrl={videoData.url}
          videoTitle={videoData.title}
        />
      </div>
    );
  }

  // Common emojis for different contexts
  const emojiSuggestions = {
    positive: ['🎉', '✨', '🌟', '💪', '🔥', '👏', '💯'],
    emphasis: ['❗', '‼️', '⚡', '💡', '🎯', '🎬'],
    food: ['🍕', '🍽️', '🍴', '👨‍🍳', '🔥', '😋'],
    reaction: ['😮', '🤔', '😂', '🤯', '😱', '🤤'],
    social: ['🤝', '👥', '🗣️', '📢', '🎤'],
    review: ['⭐', '💯', '📝', '🏆', '💪']
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            id: 'question',
            name: 'Question-Based',
            description: 'Start with an engaging question to hook readers',
            icon: '❓'
          },
          {
            id: 'insight',
            name: 'Key Insight',
            description: 'Focus on main takeaways and valuable insights',
            icon: '💡'
          },
          {
            id: 'howto',
            name: 'How-To Guide',
            description: 'Step-by-step explanation of processes',
            icon: '📝'
          },
          {
            id: 'story',
            name: 'Story Format',
            description: 'Narrative style with personal connection',
            icon: '📖'
          },
          {
            id: 'summary',
            name: 'Summary',
            description: 'Concise overview of main points',
            icon: '📋'
          },
          {
            id: 'reaction',
            name: 'Reaction',
            description: 'Share your reaction and thoughts',
            icon: '🎭'
          }
        ].map((template) => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplate(template.id as typeof selectedTemplate)}
            className={`p-4 rounded-lg border ${
              selectedTemplate === template.id
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-white/10 bg-black/20 hover:bg-black/30'
            }`}
          >
            <div className="text-2xl mb-2">{template.icon}</div>
            <h4 className="text-white font-medium">{template.name}</h4>
            <p className="text-gray-400 text-sm">{template.description}</p>
          </button>
        ))}
      </div>

      <div className="space-y-6 mt-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h4 className="text-lg font-medium text-white mb-6">Post Settings</h4>
          <p className="text-gray-400 mb-6">Adjust these settings to customize your social media post. Start with balanced settings and adjust as needed.</p>
          
          <div className="space-y-6">
            <div>
              <label className="text-white">Tone</label>
              <span className="text-gray-400 text-sm">Set the overall tone</span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 0, label: 'Casual', desc: 'Friendly & relaxed' },
                  { value: 50, label: 'Neutral', desc: 'Professional yet approachable' },
                  { value: 100, label: 'Professional', desc: 'Formal & authoritative' }
                ].map(({ value, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => setPostSettings(prev => ({ ...prev, tone: value }))}
                    className={`p-3 rounded text-left flex flex-col items-start ${
                      postSettings.tone === value
                        ? 'bg-purple-500 text-white' : 'bg-black/20 text-gray-300 hover:bg-black/30'
                    }`}
                  >
                    <div className="font-medium">{label}</div>
                    <div className="text-xs sm:text-sm opacity-80 w-full">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white">Length</label>
                <span className="text-gray-400 text-sm">Choose post length</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'short', label: 'Short', desc: '~50 words' },
                  { value: 'standard', label: 'Standard', desc: '~100 words' },
                  { value: 'long', label: 'Long', desc: '~200 words' }
                ].map(({ value, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => setPostSettings(prev => ({ ...prev, length: value as typeof postSettings.length }))}
                    className={`p-3 rounded text-left ${
                      postSettings.length === value
                        ? 'bg-purple-500 text-white'
                        : 'bg-black/20 text-gray-300 hover:bg-black/30'
                    }`}
                  >
                    <div className="font-medium">{label}</div>
                    <div className="text-sm opacity-80">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white">Use Emojis</label>
                <span className="text-gray-400 text-sm">Let AI add relevant emojis</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setPostSettings(prev => ({ ...prev, useEmojis: !prev.useEmojis }))}
                  className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out relative ${
                    postSettings.useEmojis ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                      postSettings.useEmojis ? 'transform translate-x-6' : ''
                    }`}
                  />
                </button>
                <span className="text-gray-400 ml-2">{postSettings.useEmojis ? 'On' : 'Off'}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between mb-2">
                <label className="text-white">Personality</label>
                <span className="text-gray-400 text-sm">Adjust writing style</span>
              </div>
              {personalityTraits.map(({ trait, emoji, desc }) => (
                <div key={trait}>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span className="flex items-center gap-2">
                      <span>{emoji}</span>
                      <span className="capitalize">{trait}</span>
                      <span className="text-gray-500">- {desc}</span>
                    </span>
                    <span>{postSettings.personality[trait]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={postSettings.personality[trait]}
                    onChange={(e) => setPostSettings(prev => ({
                      ...prev,
                      personality: {
                        ...prev.personality,
                        [trait]: parseInt(e.target.value)
                      }
                    }))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleGeneratePost}
          disabled={generating}
          className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? 'Generating...' : 'Generate Post'}
        </button>
        <button
          onClick={onReturn}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          New URL
        </button>
      </div>
    </div>
  );
}
