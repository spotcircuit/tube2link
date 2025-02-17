'use client'

import dynamic from 'next/dynamic'
import React, { useRef, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { FaLinkedin, FaFacebookSquare, FaTwitter, FaPinterest, FaReddit, FaTumblr, FaEnvelope, FaCopy } from 'react-icons/fa'
import type { Editor as TinyMCEEditor, IAllProps } from '@tinymce/tinymce-react'
import { Editor as TinyMCEEditorType } from 'tinymce'

type SocialPlatform = 'linkedin' | 'facebook' | 'twitter' | 'pinterest' | 'reddit' | 'tumblr' | 'email';

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

  const decodeHtmlEntities = (text: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value
      .replace(/[\u2018\u2019]/g, "'") // Smart quotes to regular single quotes
      .replace(/[\u201C\u201D]/g, '"') // Smart quotes to regular double quotes
      .replace(/&rsquo;/g, "'")
      .replace(/&ldquo;|&rdquo;/g, '"')
      .replace(/&mdash;/g, '—')
      .replace(/&nbsp;/g, ' ');
  };

  const handleCopy = useCallback(() => {
    if (!editorRef.current?.getContent) {
      toast.error('Editor not initialized');
      return;
    }
    
    const content = editorRef.current.getContent();
    const plainText = decodeHtmlEntities(content.replace(/<[^>]*>/g, ''));
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
    const text = decodeHtmlEntities(content.replace(/<[^>]*>/g, '')).trim();
    const encodedUrl = encodeURIComponent(videoUrl || '');

    try {
      await navigator.clipboard.writeText(text);

      let shareUrl = '';
      // Consistent window features for all platforms
      const windowFeatures = 'width=550,height=700,left=200,top=100,scrollbars=yes,resizable=yes';

      switch (platform) {
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
          toast.success('Content copied! Paste it into LinkedIn after the window opens', {
            duration: 5000,
            icon: '📋'
          });
          window.open(shareUrl, '_blank', windowFeatures);
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
          toast.success('Content copied! Paste it into Facebook after the window opens', {
            duration: 5000,
            icon: '📋'
          });
          window.open(shareUrl, '_blank', windowFeatures);
          break;
        case 'twitter':
          const twitterText = text.length > 280 ? text.slice(0, 277) + '...' : text;
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodedUrl}`;
          toast.success('Opening Twitter...', {
            duration: 3000,
            icon: '🐦'
          });
          window.open(shareUrl, '_blank', windowFeatures);
          break;
        case 'pinterest':
          // Get first line as title, rest as description
          const lines = text.split('\n');
          const title = lines[0];
          const description = lines.slice(1).join('\n');
          
          // Get video thumbnail URL from YouTube URL
          const videoId = videoUrl.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/) || [];
          const thumbnailUrl = videoId[1] ? `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg` : '';
          
          shareUrl = `https://pinterest.com/pin/create/button/` +
            `?url=${encodeURIComponent(videoUrl)}` +
            `&media=${encodeURIComponent(thumbnailUrl)}` +
            `&description=${encodeURIComponent(title + '\n\n' + description)}`;
          
          toast.success('Opening Pinterest...', {
            duration: 3000,
            icon: '📌'
          });
          window.open(shareUrl, '_blank', windowFeatures);
          break;
        case 'reddit':
          // Get first line as title, fallback to video title if no text
          const redditTitle = text.split('\n')[0] || videoTitle || 'Check out this video';
          shareUrl = `https://www.reddit.com/submit` +
            `?url=${encodeURIComponent(videoUrl)}` +
            `&title=${encodeURIComponent(redditTitle)}` +
            `&resubmit=true`;
          
          toast.success('Opening Reddit...', {
            duration: 3000,
            icon: '🤖'
          });
          window.open(shareUrl, '_blank', windowFeatures);
          break;
        case 'tumblr':
          // Get first line as title, fallback to video title
          const tumblrTitle = text.split('\n')[0] || videoTitle || 'Check out this video';
          // Use /widgets/share endpoint for better post creation
          shareUrl = `https://www.tumblr.com/widgets/share/tool` +
            `?canonicalUrl=${encodeURIComponent(videoUrl)}` +
            `&title=${encodeURIComponent(tumblrTitle)}` +
            `&caption=${encodeURIComponent(text || '')}` +
            `&tags=youtube,video` +
            `&posttype=link`;
          
          toast.success('Opening Tumblr...', {
            duration: 3000,
            icon: '📝'
          });
          window.open(shareUrl, '_blank', windowFeatures);
          break;
        case 'email':
          // Use mailto: protocol for email sharing
          const emailTitle = text.split('\n')[0] || videoTitle || 'Check out this video';
          const emailBody = text ? `${text}\n\n${videoUrl}` : `Check out this video: ${videoUrl}`;
          shareUrl = `mailto:?` +
            `subject=${encodeURIComponent(emailTitle)}` +
            `&body=${encodeURIComponent(emailBody)}`;
          
          toast.success('Opening email client...', {
            duration: 3000,
            icon: '✉️'
          });
          window.open(shareUrl, '_blank', windowFeatures);
          break;
      }
    } catch (error) {
      toast.error('Failed to share content');
    }
  }, [editorRef, onCopy, videoUrl]);

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
            className="p-2 text-gray-400 hover:text-sky-400 transition-colors"
            title="Share on Twitter"
          >
            <FaTwitter className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleShare('pinterest')}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Share on Pinterest"
          >
            <FaPinterest className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleShare('reddit')}
            className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
            title="Share on Reddit"
          >
            <FaReddit className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleShare('tumblr')}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            title="Share on Tumblr"
          >
            <FaTumblr className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleShare('email')}
            className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
            title="Share via Email"
          >
            <FaEnvelope className="w-5 h-5" />
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
