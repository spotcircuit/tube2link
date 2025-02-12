'use client'

import dynamic from 'next/dynamic'
import React, { useRef } from 'react'
import { toast } from 'react-hot-toast'
import { FaLinkedin, FaFacebookSquare, FaTwitter, FaInstagram, FaTiktok, FaCopy } from 'react-icons/fa'
import type { Editor as TinyMCEEditor, IAllProps } from '@tinymce/tinymce-react'
import { Editor as TinyMCEEditorType } from 'tinymce'

interface RichTextEditorProps {
  content: string
  onReturn: () => void
  onCopy: () => void
  className?: string
  videoUrl?: string
  videoTitle?: string
}

// Dynamically import TinyMCE Editor with SSR disabled
const Editor = dynamic(
  () => import('@tinymce/tinymce-react').then((mod) => {
    const { Editor } = mod;
    return Editor as React.ComponentType<IAllProps>;
  }),
  { ssr: false }
)

const RichTextEditor = ({ content, onReturn, onCopy, className = '', videoUrl = '', videoTitle = '' }: RichTextEditorProps) => {
  const editorRef = useRef<TinyMCEEditorType | null>(null)

  const handleCopy = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent()
      navigator.clipboard.writeText(content.replace(/<[^>]*>/g, ''))
      onCopy()
    }
  }

  const handleShare = async (platform: 'linkedin' | 'facebook' | 'twitter' | 'instagram' | 'tiktok') => {
    if (!editorRef.current) return

    const text = editorRef.current.getContent().replace(/<[^>]*>/g, '').trim()
    const encodedUrl = encodeURIComponent(videoUrl)

    // Always copy to clipboard for reference
    await navigator.clipboard.writeText(text)

    let shareUrl = ''
    switch (platform) {
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        toast.success('Content copied! Paste it into LinkedIn after the window opens', {
          duration: 5000,
          icon: '📋'
        })
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        toast.success('Content copied! Paste it into Facebook after the window opens', {
          duration: 5000,
          icon: '📋'
        })
        break
      case 'twitter':
        // Twitter has a character limit, so we'll truncate if needed
        const twitterText = text.length > 280 ? text.slice(0, 277) + '...' : text
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodedUrl}`
        toast.success('Opening Twitter...', {
          duration: 3000,
          icon: '🐦'
        })
        break
      case 'instagram':
        shareUrl = 'https://www.instagram.com'
        toast.success('Content copied! Open Instagram Stories and paste your content', {
          duration: 6000,
          icon: '📸'
        })
        break
      case 'tiktok':
        shareUrl = 'https://www.tiktok.com/upload'
        toast.success('Content copied! Open TikTok and paste your content in the caption', {
          duration: 6000,
          icon: '🎵'
        })
        break
    }

    // Short delay to ensure clipboard is ready
    setTimeout(() => {
      window.open(shareUrl, '_blank', 'width=600,height=600')
    }, 500)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <button
          onClick={onReturn}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          ← Back to Templates
        </button>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <button
            onClick={() => handleShare('linkedin')}
            className="p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            title="Share to LinkedIn"
          >
            <FaLinkedin className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="p-3 text-white bg-blue-800 rounded-lg hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
            title="Share to Facebook"
          >
            <FaFacebookSquare className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="p-3 text-white bg-sky-500 rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400"
            title="Share to Twitter"
          >
            <FaTwitter className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleShare('instagram')}
            className="p-3 text-white bg-pink-600 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            title="Share to Instagram"
          >
            <FaInstagram className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleShare('tiktok')}
            className="p-3 text-white bg-black rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
            title="Share to TikTok"
          >
            <FaTiktok className="w-5 h-5" />
          </button>
          <button
            onClick={handleCopy}
            className="p-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            title="Copy Content"
          >
            <FaCopy className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="p-6">
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          onInit={(evt, editor) => editorRef.current = editor}
          initialValue={content}
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
                padding: 1rem;
                line-height: 1.6;
              }
              * {
                color: #e5e7eb !important;
              }
              .mce-content-body {
                background: #1a1a1a !important;
              }
            `
          }}
        />
      </div>
    </div>
  )
}

export default RichTextEditor
