
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
