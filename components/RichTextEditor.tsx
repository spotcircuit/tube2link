'use client'

import dynamic from 'next/dynamic'
import React, { useRef, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { FaLinkedin, FaFacebookSquare, FaTwitter, FaInstagram, FaTiktok, FaCopy } from 'react-icons/fa'
import type { Editor as TinyMCEEditor, IAllProps } from '@tinymce/tinymce-react'
import { Editor as TinyMCEEditorType } from 'tinymce'

type SocialPlatform = 'linkedin' | 'facebook' | 'twitter' | 'instagram' | 'tiktok';

interface RichTextEditorProps {
  content: string;
  onCopy: () => void;
  className?: string;
  videoUrl?: string;
  videoTitle?: string;
}

interface EditorWrapperProps extends IAllProps {
  initialValue?: string;
  apiKey?: string;
}

// Dynamically import TinyMCE Editor with SSR disabled
const Editor = dynamic<EditorWrapperProps>(
  () => import('@tinymce/tinymce-react').then(({ Editor }) => {
    return function EditorWrapper(props: EditorWrapperProps) {
      return <Editor {...props} onInit={(evt, editor) => {
        if (props.onInit) {
          props.onInit(evt, editor);
        }
      }} />;
    };
  }),
  { ssr: false }
);

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  content, 
  onCopy, 
  className = '', 
  videoUrl = '', 
  videoTitle = '' 
}) => {
  const editorRef = useRef<TinyMCEEditorType | null>(null);

  const handleCopy = useCallback(() => {
    if (!editorRef.current?.getContent) {
      toast.error('Editor not initialized');
      return;
    }
    
    const content = editorRef.current.getContent();
    const plainText = content.replace(/<[^>]*>/g, '');
    navigator.clipboard.writeText(plainText).then(() => {
      onCopy();
    }).catch(() => {
      toast.error('Failed to copy content');
    });
  }, [onCopy]);

  const handleShare = useCallback(async (platform: SocialPlatform) => {
    if (!editorRef.current?.getContent) {
      toast.error('Editor not initialized');
      return;
    }

    const content = editorRef.current.getContent();
    const text = content.replace(/<[^>]*>/g, '').trim();
    const encodedUrl = encodeURIComponent(videoUrl || '');

    try {
      await navigator.clipboard.writeText(text);

      let shareUrl = '';
      switch (platform) {
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
          toast.success('Content copied! Paste it into LinkedIn after the window opens', {
            duration: 5000,
            icon: '📋'
          });
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
          toast.success('Content copied! Paste it into Facebook after the window opens', {
            duration: 5000,
            icon: '📋'
          });
          break;
        case 'twitter':
          const twitterText = text.length > 280 ? text.slice(0, 277) + '...' : text;
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodedUrl}`;
          toast.success('Opening Twitter...', {
            duration: 3000,
            icon: '🐦'
          });
          break;
        case 'instagram':
          shareUrl = 'https://www.instagram.com';
          toast.success('Content copied! Open Instagram Stories and paste your content', {
            duration: 6000,
            icon: '📸'
          });
          break;
        case 'tiktok':
          shareUrl = 'https://www.tiktok.com/upload';
          toast.success('Content copied! Open TikTok and paste your content in the caption', {
            duration: 6000,
            icon: '🎵'
          });
          break;
      }

      // Short delay to ensure clipboard is ready
      setTimeout(() => {
        window.open(shareUrl, '_blank', 'width=600,height=600');
      }, 100);
    } catch (error) {
      toast.error('Failed to share content');
    }
  }, [videoUrl]);

  return (
    <div className={`bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
            title="Copy to clipboard"
          >
            <FaCopy className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleShare('linkedin')}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            title="Share on LinkedIn"
          >
            <FaLinkedin className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Share on Facebook"
          >
            <FaFacebookSquare className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
            title="Share on Twitter"
          >
            <FaTwitter className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleShare('instagram')}
            className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
            title="Share on Instagram"
          >
            <FaInstagram className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleShare('tiktok')}
            className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
            title="Share on TikTok"
          >
            <FaTiktok className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="p-6">
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || ''}
          initialValue={content}
          onInit={(_, editor) => {
            editorRef.current = editor;
          }}
          init={{
            height: 900,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
              'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            skin: 'oxide-dark',
            content_css: 'dark',
            content_style: `
              :root {
                color-scheme: dark;
              }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                font-size: 16px;
                color: #e5e7eb;
                background: #1a1a1a;
                padding: 2rem;
                line-height: 1.6;
                margin-bottom: 2rem;
              }
              * {
                color: #e5e7eb !important;
              }
              .mce-content-body {
                background: #1a1a1a !important;
              }
            `,
            forced_root_block: 'div',
            remove_linebreaks: false,
            convert_newlines_to_brs: true,
            remove_redundant_brs: false
          }}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
