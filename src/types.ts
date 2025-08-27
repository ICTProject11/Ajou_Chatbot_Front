// src/types.ts
export type MainCategory = 'yoram' | 'info' | 'announcement' | 'menu';

export type Message = {
  id: string;
  role: 'user' | 'bot';
  content: string;
  pending?: boolean;
};

export type AskResult = {
  answer?: string;
  error?: string | null;
  sources?: string[];
  clarification?: string | null;
};