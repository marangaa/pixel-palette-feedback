export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
  }
  
  export interface FeedbackAnalysis {
    satisfaction: number;
    feedback: string;
    category: 'bug' | 'feature' | 'experience' | 'other';
    sentiment: 'positive' | 'negative' | 'neutral';
  }