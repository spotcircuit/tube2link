import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';
import JsonLd from '@/components/JsonLd';
import type { SchemaData } from '@/types/schema';

const inter = Inter({ subsets: ['latin'] });

const schemaData: SchemaData = {
  webApplication: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Tube2Link',
    description: 'Transform your YouTube videos into engaging posts across all your social media platforms automatically with combination of your wit, charm, and AI-powered content generation.',
    applicationCategory: 'SocialMediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    url: 'https://www.tube2link.com'
  },
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SpotCircuit',
    url: 'https://www.spotcircuit.com',
    logo: 'https://www.tube2link.com/logo.png',
    sameAs: [
      'https://github.com/spotcircuit',
      'https://portfolio.spotcircuit.com'
    ]
  },
  faqPage: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Tube2Link?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tube2Link is a web application that converts YouTube videos into engaging social media posts using AI technology. It helps content creators repurpose their video content efficiently.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does Tube2Link work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Simply paste your YouTube video URL, adjust the tone and length settings, and Tube2Link will generate a social media post optimized for your chosen platform using AI-powered content generation.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is Tube2Link free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Tube2Link is currently free to use. We offer AI-powered content generation to help you transform your YouTube videos into engaging social media posts.'
        }
      }
    ]
  }
};

export const metadata: Metadata = {
  title: 'Tube2Link - Convert YouTube Videos to Social Media Posts',
  description: 'Transform your YouTube content into engaging posts across all your social media platforms automatically with combination of your wit, charm, and AI-powered content generation.',
  keywords: 'youtube to social, facebook, meta, linkedin, instagram, tiktok, pinterest, content repurposing, social media automation, video to text, AI content generation',
  authors: [{ name: 'SpotCircuit' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Tube2Link - Convert YouTube Videos to Social Media Posts',
    description: 'Transform your YouTube content into engaging posts across all your social media platforms automatically with combination of your wit, charm, and AI-powered content generation.',
    url: 'https://www.tube2link.com',
    siteName: 'Tube2Link',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tube2Link - YouTube to LinkedIn Converter',
    description: 'Transform your YouTube videos into engaging LinkedIn posts',
    creator: '@spotcircuit',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.tube2link.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} h-full bg-black`}>
        <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm py-2">
          <div className="container mx-auto px-4 flex justify-center items-center space-x-2">
            <span>A project by</span>
            <a 
              href="https://www.spotcircuit.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              SpotCircuit
            </a>
            <span>|</span>
            <a 
              href="https://portfolio.spotcircuit.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              View Portfolio
            </a>
          </div>
        </div>
        <JsonLd data={schemaData} />
        <main>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '8px',
              },
            }}
          />
          {children}
        </main>
      </body>
    </html>
  );
}
