// src/components/MessageBubble.tsx

import React from 'react';
import type { Message } from '../types';
import TypingDots from './TypingDots';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  msg: Message;
  isWelcome?: boolean;
}

export default function MessageBubble({ msg, isWelcome = false }: MessageBubbleProps) {
  const className = `bubble ${msg.role === 'user' ? 'from-user' : 'from-bot'}${isWelcome ? ' welcome-message' : ''}`;
  
  if (msg.pending) {
    return (
      <div className="bubble from-bot typing">
        <TypingDots />
      </div>
    );
  }
  
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
    </div>
  );
}