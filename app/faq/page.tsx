'use client';

import { useState, type FC, type MouseEvent, Suspense } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import type { FAQItem, FAQCategory, CategoryButtonProps, FAQItemProps } from '@/types/faq';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const faqItems: readonly FAQItem[] = [
  {
    category: "Getting Started",
    question: "How do I convert a YouTube video to a social media post using Tube2Link?",
    answer: `Converting a YouTube video to a social media post with Tube2Link is simple:
    1. Paste your YouTube video URL in the input field
    2. Choose your tone (Casual, Neutral, or Formal)
    3. Pick your content length (Brief, Regular, or Detailed)
    4. Click "Generate" to create your post
    
    Our AI will automatically analyze your video content to determine the best template (Technical, Review, News, etc.) and create a platform-optimized post following your selected parameters.`
  },
  {
    category: "Templates",
    question: "How does Tube2Link determine which template to use for my content?",
    answer: `Tube2Link uses advanced AI to automatically analyze your video and select the most appropriate template:

    1. Content Analysis
       • AI examines video title, description, and transcription
       • Identifies key themes and content type
       • Determines video purpose and structure
    
    2. Template Selection
       • Technical/Instructional - For how-to guides and tutorials
       • Product Review - For product demonstrations and evaluations
       • News/Updates - For announcements and trending topics
       • Recipe/Process - For step-by-step instructions
       • Comparison - For product or method comparisons
       • Commentary - For opinion pieces and analysis
    
    The AI automatically selects the best template based on your video's content, ensuring optimal formatting and engagement for each social media platform.`
  },
  {
    category: "Platforms",
    question: "Which social media platforms does Tube2Link support for content generation?",
    answer: `Tube2Link generates optimized content for all major social media platforms including:
    • LinkedIn - professional networking and thought leadership
    • Facebook - community engagement and brand building
    • Instagram - visual storytelling and engagement
    • Twitter (X) - concise updates and news sharing
    • Pinterest - visual discovery and inspiration
    
    Each platform's specific content requirements and best practices are automatically considered in the generation process.`
  },
  {
    category: "Content Settings",
    question: "How do Tube2Link's tone settings affect the generated content?",
    answer: `Tube2Link offers three distinct tone settings:
    1. Casual Tone
       • Uses conversational language and first-person perspective
       • Best for personal branding and community building
       • Includes emoji usage and storytelling elements
    
    2. Neutral Tone
       • Employs balanced, clear language
       • Best for general business communication
       • Uses professional yet accessible language
    
    3. Formal Tone
       • Utilizes professional, authoritative language
       • Best for technical content and corporate communications
       • Includes industry terminology and detailed analysis`
  },
  {
    category: "Content Settings",
    question: "What content lengths are available in Tube2Link and how should I choose between them?",
    answer: `Tube2Link offers three content length options:
    1. Brief (150-200 words)
       • Best for: Quick updates and engagement posts
       • Ideal for: Twitter, Instagram
       • Features: Concise key points, clear call-to-action
    
    2. Regular (200-300 words)
       • Best for: Standard social posts and comprehensive summaries
       • Ideal for: LinkedIn, Facebook
       • Features: Balanced detail and readability
    
    3. Detailed (300-500 words)
       • Best for: In-depth analysis and technical explanations
       • Ideal for: LinkedIn articles, comprehensive reviews
       • Features: Thorough coverage, multiple sections`
  },
  {
    category: "Platforms",
    question: "How do I share the generated content on different social media platforms?",
    answer: `Each platform has a different sharing mechanism:

    • Twitter (X) - Click the Twitter icon to automatically post (requires authentication)
    • LinkedIn - Click the LinkedIn icon to copy the content to clipboard, then paste (Ctrl+V) into LinkedIn
    • Facebook - Click the Facebook icon to copy content, then paste into Facebook
    • Instagram - Click the Instagram icon to copy content, then paste into Instagram
    • Pinterest - Click the Pinterest icon to copy content, then paste into Pinterest

    Note: The video link is automatically included in the copied content. For platforms that don't support automatic posting, simply paste (Ctrl+V) the copied content into your social media platform's post editor.`
  },
  {
    category: "Content Settings",
    question: "How do I customize the personality and emoji usage in my posts?",
    answer: `You can customize the personality and emoji usage through several settings:

    1. Emoji Toggle
       • Enable/disable emoji usage in your posts
       • Control emoji density (Light, Moderate, Heavy)
       • Platform-specific emoji optimization
    
    2. Personality Settings
       • Professional - Minimal emojis, formal language
       • Friendly - Moderate emojis, conversational tone
       • Casual - Liberal emoji use, informal language
       • Custom - Set your own emoji and personality preferences
    
    Note: Some platforms (like LinkedIn) work better with fewer emojis, while others (like Instagram) are more emoji-friendly. Our AI automatically adjusts emoji usage based on the platform.`
  },
  {
    category: "Platforms",
    question: "Which social media platforms support automatic posting vs. manual copying?",
    answer: `Platform Posting Methods:

    Automatic Posting (requires authentication):
    • Twitter (X) - Direct posting through API
    • Facebook Pages - Direct posting through API (business accounts only)
    
    Manual Copy & Paste:
    • LinkedIn - Copy to clipboard, paste into LinkedIn post
    • Instagram - Copy to clipboard, paste into Instagram
    • Facebook Personal - Copy to clipboard, paste into Facebook
    • Pinterest - Copy to clipboard, paste into Pinterest
    
    For manual platforms, we automatically format the content and include the video link. Just click the platform icon to copy, then use Ctrl+V (or Command+V on Mac) to paste into your chosen platform.`
  }
] as const;

const animationVariants: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 }
};

const CategoryButton: FC<CategoryButtonProps> = ({ category, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'bg-white/10 text-white/80 hover:bg-white/20'
    }`}
  >
    {category}
  </button>
);

const FAQItemComponent: FC<FAQItemProps> = ({ item, isExpanded, onToggle }) => (
  <div className="backdrop-blur-lg bg-black/80 rounded-lg border border-white/10 overflow-hidden shadow-xl">
    <button
      onClick={onToggle}
      className="w-full px-6 py-4 text-left flex justify-between items-center text-white hover:bg-white/5 transition-colors"
    >
      <span className="font-medium">{item.question}</span>
      <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
        ▼
      </span>
    </button>

    <AnimatePresence>
      {isExpanded && (
        <motion.div
          variants={animationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <div className="px-6 py-4 border-t border-white/10 bg-black/40">
            <p className="text-white/90 whitespace-pre-line">
              {item.answer}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const LoadingSpinner: FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      <h2 className="text-2xl font-semibold text-white mt-4">Loading...</h2>
    </div>
  </div>
);

const FAQContent: FC = () => {
  const [activeCategory, setActiveCategory] = useState<'All' | FAQCategory>('All');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const categories: readonly string[] = ['All', ...Array.from(new Set(faqItems.map(item => item.category)))] as const;
  
  const filteredFAQs: readonly FAQItem[] = activeCategory === 'All'
    ? faqItems
    : faqItems.filter(item => item.category === activeCategory);

  const handleCategoryClick = (category: typeof activeCategory) => {
    setActiveCategory(category);
    setExpandedIndex(null);
  };

  const handleItemToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Frequently Asked Questions
        </h1>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <CategoryButton
              key={category}
              category={category}
              isActive={activeCategory === category}
              onClick={() => handleCategoryClick(category as typeof activeCategory)}
            />
          ))}
        </div>

        <div className="space-y-6">
          {filteredFAQs.map((item, index) => (
            <FAQItemComponent
              key={`${item.category}-${index}`}
              item={item}
              isExpanded={expandedIndex === index}
              onToggle={() => handleItemToggle(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const FAQPage: FC = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <FAQContent />
    </Suspense>
  </ErrorBoundary>
);

export default FAQPage;
