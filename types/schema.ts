export interface Template {
  type: 'technical' | 'review' | 'news' | 'recipe' | 'comparison' | 'commentary';
  name: string;
  description: string;
  structure: {
    sections: string[];
    keyElements: string[];
  };
}

export interface Tone {
  type: 'casual' | 'neutral' | 'formal';
  name: string;
  description: string;
  characteristics: string[];
}

export interface Length {
  type: 'brief' | 'regular' | 'detailed';
  name: string;
  description: string;
  wordCount: {
    min: number;
    max: number;
  };
}

export interface WebApplication {
  '@context': 'https://schema.org';
  '@type': 'WebApplication';
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
  url: string;
}

export interface Organization {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
}

export interface FAQPage {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export interface SchemaData {
  webApplication: WebApplication;
  organization: Organization;
  faqPage: FAQPage;
}
