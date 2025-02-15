import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import JsonLd from '@/components/JsonLd';

const inter = Inter({ subsets: ['latin'] });

const schemaData = {
  webApplication: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Tube2Link',
    description: 'Transform your YouTube videos into engaging posts for LinkedIn, Facebook, Instagram, Twitter (X), Pinterest, and more. Create platform-specific content automatically with AI-powered generation.',
    applicationCategory: 'SocialMediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    url: 'https://www.tube2link.com',
    image: [
      {
        '@type': 'ImageObject',
        url: 'https://www.tube2link.com/images/tube2linkedin.png',
        width: '1200',
        height: '630',
        caption: 'Tube2Link - Convert YouTube Videos to Social Media Posts'
      },
      {
        '@type': 'ImageObject',
        url: 'https://www.tube2link.com/images/app-screenshot.png',
        width: '1920',
        height: '1080',
        caption: 'Tube2Link Application Interface'
      }
    ],
    screenshot: {
      '@type': 'ImageObject',
      url: 'https://www.tube2link.com/images/app-interface.png',
      width: '1920',
      height: '1080',
      caption: 'Tube2Link User Interface'
    }
  },
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SpotCircuit',
    url: 'https://www.spotcircuit.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.spotcircuit.com/logo.png',
      width: '512',
      height: '512',
      caption: 'SpotCircuit Logo'
    },
    image: {
      '@type': 'ImageObject',
      url: 'https://www.spotcircuit.com/banner.png',
      width: '1200',
      height: '630',
      caption: 'SpotCircuit - AI-Powered Solutions'
    },
    sameAs: [
      'https://twitter.com/spotcircuit',
      'https://www.linkedin.com/company/spotcircuit'
    ]
  },
  faqPage: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I convert a YouTube video to a social media post using Tube2Link?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Converting a YouTube video to a social media post with Tube2Link is simple: 1. Paste your YouTube video URL in the input field, 2. Select your desired template (Technical, Review, News, etc.), 3. Choose your tone (Casual, Neutral, or Formal), 4. Pick your content length (Brief, Regular, or Detailed), 5. Click "Generate" to create your post. The AI will analyze your video content and create a platform-optimized post following your selected parameters.'
        }
      },
      {
        '@type': 'Question',
        name: 'Which social media platforms does Tube2Link support for content generation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tube2Link generates optimized content for all major social media platforms including: 1. LinkedIn - professional networking and thought leadership, 2. Facebook - community engagement and brand building, 3. Instagram - visual storytelling and engagement, 4. Twitter (X) - concise updates and news sharing, 5. Pinterest - visual discovery and inspiration. Each platform\'s specific content requirements and best practices are automatically considered in the generation process.'
        }
      },
      {
        '@type': 'Question',
        name: 'What are the different content templates available in Tube2Link and when should I use them?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tube2Link offers six specialized content templates: 1. Technical/Instructional Template - Best for tutorials, how-to guides, and educational content. Includes sections for prerequisites, step-by-step instructions, and technical details. 2. Product Review Template - Ideal for product demonstrations, features overview, and honest evaluations. Structured with pros, cons, and recommendations. 3. News/Updates Template - Perfect for industry news, announcements, and trending topics. Focuses on key points and implications. 4. Recipe/Process Template - Suited for cooking tutorials, DIY projects, or any step-by-step process. Includes ingredients/materials, steps, and tips. 5. Comparison Template - Excellent for comparing products, services, or methodologies. Provides structured comparison points and analysis. 6. Commentary Template - Best for opinion pieces, analysis, and thought leadership. Includes context, analysis, and key takeaways.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do Tube2Link\'s tone settings affect the generated content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tube2Link offers three distinct tone settings that shape your content\'s voice and style: 1. Casual Tone - Uses conversational language, first-person perspective, and engaging expressions. Best for: Personal branding, community building, and relatable content. Characteristics: Emoji usage, informal language, and storytelling elements. 2. Neutral Tone - Employs balanced, clear, and straightforward language. Best for: General business communication, news sharing, and broad audience reach. Characteristics: Professional yet accessible language, objective statements, and clear structure. 3. Formal Tone - Utilizes professional, authoritative, and industry-specific language. Best for: Technical content, corporate communications, and academic topics. Characteristics: Industry terminology, third-person perspective, and detailed analysis.'
        }
      },
      {
        '@type': 'Question',
        name: 'What content lengths are available in Tube2Link and how should I choose between them?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tube2Link offers three content length options: 1. Brief (150-200 words) - Best for: Quick updates, engagement posts, and time-sensitive content. Ideal platforms: Twitter, Instagram. Features: Concise key points, clear call-to-action, high engagement focus. 2. Regular (200-300 words) - Best for: Standard social posts, detailed updates, and comprehensive summaries. Ideal platforms: LinkedIn, Facebook. Features: Balanced detail and readability, supporting points, professional tone. 3. Detailed (300-500 words) - Best for: In-depth analysis, thought leadership, and technical explanations. Ideal platforms: LinkedIn articles, comprehensive reviews. Features: Thorough coverage, multiple sections, detailed examples.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does Tube2Link optimize content for different social media platforms?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tube2Link optimizes content for each platform through: 1. Platform-Specific Formatting - Adapts content length, structure, and style to each platform\'s requirements. 2. Engagement Elements - Incorporates platform-appropriate hashtags, mentions, and calls-to-action. 3. Content Structure - Uses platform-optimized formatting like bullet points for LinkedIn or shorter paragraphs for Facebook. 4. Character Limits - Automatically adjusts content to meet platform restrictions (e.g., Twitter\'s character limit). 5. SEO Optimization - Includes relevant keywords and phrases for better visibility. 6. Visual Integration - Provides suggestions for image placement and video timestamps where relevant.'
        }
      },
      {
        '@type': 'Question',
        name: 'What makes Tube2Link\'s Technical/Instructional template effective for educational content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Technical/Instructional template is optimized for educational content through: 1. Structured Learning Flow - Introduction → Prerequisites → Core Concepts → Step-by-Step Instructions → Conclusion. 2. Knowledge Components - Clear prerequisites, technical requirements, and learning objectives. 3. Implementation Details - Detailed steps, code snippets, or technical specifications when relevant. 4. Visual Integration - References to video timestamps for complex demonstrations. 5. Resource Links - Documentation, additional reading, and related tutorials. 6. Troubleshooting - Common issues and solutions. 7. Best Practices - Industry standards and recommended approaches.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does Tube2Link\'s Review/Comparison template help users make informed decisions?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Review/Comparison template aids decision-making through: 1. Structured Analysis - Overview → Features → Pros/Cons → Comparison → Verdict. 2. Evaluation Criteria - Clear comparison points and rating systems. 3. Use Case Scenarios - Specific situations where each option excels. 4. Performance Metrics - Quantitative and qualitative performance indicators. 5. Cost-Benefit Analysis - Value proposition and ROI considerations. 6. Alternative Options - Similar products or solutions to consider. 7. Recommendation Framework - Decision-making guidance based on user needs and preferences.'
        }
      }
    ]
  }
};

export const metadata: Metadata = {
  title: 'Tube2Link - Convert YouTube Videos to Social Media Posts',
  description: 'Transform your YouTube videos into engaging posts for LinkedIn, Facebook, Instagram, Twitter (X), Pinterest, and more. Create platform-specific content automatically with AI-powered generation.',
  keywords: 'youtube to social, facebook, meta, linkedin, instagram, twitter, x, pinterest, content repurposing, social media automation, video to text, AI content generation',
  authors: [{ name: 'SpotCircuit' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Tube2Link - Convert YouTube Videos to Social Media Posts',
    description: 'Transform your YouTube videos into engaging posts for LinkedIn, Facebook, Instagram, Twitter (X), Pinterest, and more. Create platform-specific content automatically with AI-powered generation.',
    url: 'https://www.tube2link.com',
    siteName: 'Tube2Link',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tube2Link - YouTube to Social Media Converter',
    description: 'Transform your YouTube videos into engaging posts for LinkedIn, Facebook, Instagram, Twitter (X), Pinterest, and more.',
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
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              schemaData.webApplication,
              schemaData.organization,
              schemaData.faqPage
            ]
          }}
        />
      </head>
      <body className={`${inter.className} h-full bg-black`}>
        <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm py-2">
          <div className="container mx-auto px-4 flex justify-center items-center space-x-2">
            <span>A project by</span>
            <a href="https://www.spotcircuit.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
              SpotCircuit
            </a>
            <span>|</span>
            <a href="/faq" className="text-blue-400 hover:text-blue-300 transition-colors">
              FAQ
            </a>
            <span>|</span>
            <a href="https://portfolio.spotcircuit.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
              View Portfolio
            </a>
          </div>
        </div>
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
