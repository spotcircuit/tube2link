'use client';

import { useState } from 'react';
import { VideoData } from '@/types/video';
import { PostSettings } from '@/types/post';
import { toast } from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';

interface SocialPostGeneratorProps {
  videoData: VideoData;
  onReturn?: () => void;
  onCopy?: () => void;
}

export default function SocialPostGenerator({ videoData, onReturn, onCopy }: SocialPostGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [showTemplateOptions, setShowTemplateOptions] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<'question' | 'insight' | 'howto'>('question');
  const [postSettings, setPostSettings] = useState<PostSettings>({
    tone: 50,
    length: 'standard',
    personality: {
      charm: 0,
      wit: 0,
      humor: 0,
      sarcasm: 0
    }
  });

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

      if (!response.ok) {
        throw new Error('Failed to generate post');
      }

      const data = await response.json();
      setEditorContent(data.content);
      setShowTemplateOptions(false);
      setShowEditor(true);
    } catch (error) {
      console.error('Error generating post:', error);
      toast.error('Failed to generate post');
    } finally {
      setGenerating(false);
    }
  };

  const handlePreprocess = async () => {
    if (!videoData) {
      toast.error('No video data available');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/preprocess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoData }),
      });

      if (!response.ok) {
        throw new Error('Failed to preprocess video');
      }

      setShowTemplateOptions(true);
    } catch (error) {
      console.error('Error preprocessing:', error);
      toast.error('Failed to preprocess video');
    } finally {
      setGenerating(false);
    }
  };

  if (showEditor) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setShowEditor(false);
              setShowTemplateOptions(true);
            }}
            className="text-purple-300 hover:text-purple-200"
          >
            ← Back to Templates
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(editorContent);
              onCopy?.();
            }}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Copy Content
          </button>
        </div>
        <RichTextEditor
          initialContent={editorContent}
          onChange={setEditorContent}
          readOnly={false}
        />
      </div>
    );
  }

  if (showTemplateOptions) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white">Choose Post Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              id: 'question',
              name: 'Question-Based',
              description: 'Start with an engaging question'
            },
            {
              id: 'insight',
              name: 'Key Insight',
              description: 'Focus on main takeaways'
            },
            {
              id: 'howto',
              name: 'How-To Guide',
              description: 'Step-by-step explanation'
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
              <h4 className="text-white font-medium">{template.name}</h4>
              <p className="text-gray-400 text-sm">{template.description}</p>
            </button>
          ))}
        </div>
        <div className="space-y-6 mt-8">
          <h4 className="text-lg font-medium text-white">Post Settings</h4>
          <div className="space-y-4">
            <div>
              <label className="text-white">Tone</label>
              <input
                type="range"
                min="0"
                max="100"
                value={postSettings.tone}
                onChange={(e) => setPostSettings(prev => ({
                  ...prev,
                  tone: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>Casual</span>
                <span>Professional</span>
              </div>
            </div>
            <div>
              <label className="text-white">Length</label>
              <select
                value={postSettings.length}
                onChange={(e) => setPostSettings(prev => ({
                  ...prev,
                  length: e.target.value as PostSettings['length']
                }))}
                className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"
              >
                <option value="brief">Brief</option>
                <option value="standard">Standard</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>
          </div>
        </div>
        <button
          onClick={handleGeneratePost}
          disabled={generating}
          className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? 'Generating...' : 'Generate Post'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-black/20 rounded-lg p-6 border border-white/10">
        <h4 className="text-lg font-semibold text-white mb-4">Generate Social Media Post</h4>
        <div className="space-y-4">
          <button 
            onClick={handlePreprocess}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
            disabled={!videoData?.transcription || generating}
          >
            {generating ? (
              <>
                <span className="animate-spin">⚡</span>
                <span>Processing Video...</span>
              </>
            ) : (
              <>
                <span>Process Video</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
