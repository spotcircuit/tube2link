import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tube2Link - Convert YouTube Videos to LinkedIn Posts',
  description: 'Transform your YouTube content into engaging LinkedIn posts automatically with AI-powered content generation.',
  keywords: 'youtube to linkedin, content repurposing, social media automation, video to text, AI content generation',
  authors: [{ name: 'SpotCircuit' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Tube2Link - YouTube to LinkedIn Converter',
    description: 'Transform your YouTube videos into engaging LinkedIn posts',
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
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Tube2Link",
              "description": "Transform your YouTube videos into engaging LinkedIn posts",
              "url": "https://www.tube2link.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "provider": {
                "@type": "Organization",
                "name": "SpotCircuit",
                "url": "https://www.spotcircuit.com"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <main>
          {children}
        </main>
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
      </body>
    </html>
  );
}
