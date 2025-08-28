// src/types.ts - Message 타입에 isWelcome 추가
export type MainCategory = 'yoram' | 'info' | 'announcement' | 'menu';

export type Message = {
  id: string;
  role: 'user' | 'bot';
  content: string;
  pending?: boolean;
  isWelcome?: boolean; // 환영 메시지 플래그 추가
};

export type AskResult = {
  answer?: string;
  error?: string | null;
  sources?: string[];
  clarification?: string | null;
};