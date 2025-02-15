export type FAQCategory = 'Getting Started' | 'Platforms' | 'Templates' | 'Content Settings';

export interface FAQItem {
  readonly question: string;
  readonly answer: string;
  readonly category: FAQCategory;
}

export interface CategoryButtonProps {
  readonly category: string;
  readonly isActive: boolean;
  readonly onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface FAQItemProps {
  readonly item: FAQItem;
  readonly isExpanded: boolean;
  readonly onToggle: () => void;
}
